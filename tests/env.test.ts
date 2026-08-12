import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  EnvironmentConfigurationError,
  getOptionalPublicSupabaseConfig,
  isEnvironmentConfigurationError,
  parseSiteOrigin,
  requireSiteOrigin,
  requirePublicSupabaseConfig,
} from "../lib/env/public";
import {
  getOptionalGitHubEnrichmentConfig,
  getOptionalPrivateArchiveConfig,
  requireAdminEmailAllowlist,
  requirePrivateArchiveConfig,
} from "../lib/env/server";

describe("site origin configuration", () => {
  it.each([
    ["http://localhost:3001", "http://localhost:3001"],
    ["http://localhost:3001/", "http://localhost:3001"],
    ["https://example.com", "https://example.com"],
    ["https://www.example.com/", "https://www.example.com"],
  ])("normalizes %s to its canonical origin", (value, expected) => {
    expect(parseSiteOrigin(value)).toBe(expected);
  });

  it.each([
    "not a URL",
    "https://example.com/path",
    "https://example.com?preview=true",
    "https://example.com#section",
    "https://owner:password@example.com",
    "ftp://example.com",
  ])("rejects a non-origin value: %s", (value) => {
    expect(() => parseSiteOrigin(value)).toThrow(EnvironmentConfigurationError);
  });

  it("requires an explicit site origin for OAuth-dependent features", () => {
    expect(() => requireSiteOrigin({})).toThrow(EnvironmentConfigurationError);
    expect(requireSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://example.com/" })).toBe("https://example.com");
  });
});

describe("public Supabase configuration", () => {
  it("returns public configuration when both required values are present", () => {
    expect(getOptionalPublicSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    })).toEqual({ url: "https://project.supabase.co", anonKey: "anon-key" });
  });

  it("returns null when the public Supabase configuration is entirely absent", () => {
    expect(getOptionalPublicSupabaseConfig({})).toBeNull();
  });

  it.each([
    { NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co" },
    { NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key" },
  ])("rejects a partial public Supabase configuration", (environment) => {
    expect(() => getOptionalPublicSupabaseConfig(environment)).toThrow(EnvironmentConfigurationError);
  });

  it("requires public Supabase configuration for Supabase-dependent code", () => {
    expect(() => requirePublicSupabaseConfig({})).toThrow(EnvironmentConfigurationError);
  });
});

describe("server-only configuration", () => {
  it("parses the application-level admin email allowlist without empty entries", () => {
    expect(requireAdminEmailAllowlist({
      ADMIN_EMAILS: " Owner@Example.com, ,admin@example.com ",
    })).toEqual(["owner@example.com", "admin@example.com"]);
  });

  it("rejects an absent or empty admin email allowlist", () => {
    expect(() => requireAdminEmailAllowlist({})).toThrow("ADMIN_EMAILS");
    expect(() => requireAdminEmailAllowlist({ ADMIN_EMAILS: " , " })).toThrow("ADMIN_EMAILS");
  });

  it("marks server configuration failures with the shared error code", () => {
    try {
      requireAdminEmailAllowlist({});
    } catch (error) {
      expect(isEnvironmentConfigurationError(error)).toBe(true);
      return;
    }
    throw new Error("Expected missing ADMIN_EMAILS to fail validation.");
  });

  it("disables GitHub enrichment when no username is configured", () => {
    expect(getOptionalGitHubEnrichmentConfig({ GITHUB_TOKEN: "ignored-token" })).toBeNull();
  });

  it("permits GitHub enrichment with or without a token", () => {
    expect(getOptionalGitHubEnrichmentConfig({ GITHUB_USERNAME: " zxc " })).toEqual({
      username: "zxc",
      token: undefined,
    });
    expect(getOptionalGitHubEnrichmentConfig({
      GITHUB_USERNAME: "zxc",
      GITHUB_TOKEN: "read-only-token",
    })).toEqual({ username: "zxc", token: "read-only-token" });
  });

  it("returns private archive configuration only when both server secrets are present", () => {
    expect(getOptionalPrivateArchiveConfig({})).toBeNull();
    expect(getOptionalPrivateArchiveConfig({
      PRIVATE_ARCHIVE_PASSWORD: "private-password",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    })).toEqual({ password: "private-password", serviceRoleKey: "service-role-key" });
  });

  it.each([
    { PRIVATE_ARCHIVE_PASSWORD: "private-password" },
    { SUPABASE_SERVICE_ROLE_KEY: "service-role-key" },
  ])("rejects partial private archive configuration", (environment) => {
    expect(() => getOptionalPrivateArchiveConfig(environment)).toThrow("Private archive configuration");
  });

  it("requires complete private archive configuration for protected routes", () => {
    expect(() => requirePrivateArchiveConfig({})).toThrow("Private archive features");
  });
});

describe("production environment preflight", () => {
  const script = path.resolve(process.cwd(), "scripts/validate-production-env.js");
  const productionEnvironment: NodeJS.ProcessEnv = {
    NODE_ENV: "test",
    NEXT_PUBLIC_SITE_URL: "https://example.com",
    NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    ADMIN_EMAILS: "owner@example.com",
    PRIVATE_ARCHIVE_PASSWORD: "test-private-password",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  };

  function runPreflight(environment: NodeJS.ProcessEnv) {
    return spawnSync(process.execPath, [script], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: environment,
    });
  }

  it("passes with all required production configuration and no GitHub enrichment", () => {
    expect(runPreflight(productionEnvironment).status).toBe(0);
  });

  it.each([
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "ADMIN_EMAILS",
    "PRIVATE_ARCHIVE_PASSWORD",
    "SUPABASE_SERVICE_ROLE_KEY",
  ])("fails without required production configuration: %s", (name) => {
    const result = runPreflight({ ...productionEnvironment, [name]: undefined } as NodeJS.ProcessEnv);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(name);
  });

  it("fails for a malformed production site origin", () => {
    const result = runPreflight({ ...productionEnvironment, NEXT_PUBLIC_SITE_URL: "https://example.com/path" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("NEXT_PUBLIC_SITE_URL");
  });
});

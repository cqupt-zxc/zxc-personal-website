import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  EnvironmentConfigurationError,
  getOptionalPublicSupabaseConfig,
  parseSiteOrigin,
  requirePublicSupabaseConfig,
} from "../lib/env/public";
import {
  getOptionalGitHubEnrichmentConfig,
  getOptionalPrivateArchiveConfig,
  requireAdminEmailAllowlist,
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
    expect(() => requireAdminEmailAllowlist({})).toThrow(EnvironmentConfigurationError);
    expect(() => requireAdminEmailAllowlist({ ADMIN_EMAILS: " , " })).toThrow(EnvironmentConfigurationError);
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
    expect(() => getOptionalPrivateArchiveConfig(environment)).toThrow(EnvironmentConfigurationError);
  });
});

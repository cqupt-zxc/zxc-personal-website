import "server-only";

import { EnvironmentConfigurationError, type EnvironmentValues } from "./public";

export type GitHubEnrichmentConfig = Readonly<{
  username: string;
  token: string | undefined;
}>;

export type PrivateArchiveConfig = Readonly<{
  password: string;
  serviceRoleKey: string;
}>;

function getConfiguredValue(environment: EnvironmentValues, name: string) {
  const value = environment[name];
  return value?.trim() ? value : undefined;
}

export function requireAdminEmailAllowlist(environment: EnvironmentValues = process.env) {
  const configuredEmails = getConfiguredValue(environment, "ADMIN_EMAILS");
  const emails = configuredEmails
    ?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean) ?? [];

  if (!emails.length) {
    throw new EnvironmentConfigurationError("Admin/auth configuration requires a non-empty ADMIN_EMAILS allowlist.");
  }

  return emails;
}

export function getOptionalPrivateArchiveConfig(environment: EnvironmentValues = process.env): PrivateArchiveConfig | null {
  const password = getConfiguredValue(environment, "PRIVATE_ARCHIVE_PASSWORD");
  const serviceRoleKey = getConfiguredValue(environment, "SUPABASE_SERVICE_ROLE_KEY");

  if (!password && !serviceRoleKey) return null;
  if (!password || !serviceRoleKey) {
    throw new EnvironmentConfigurationError(
      "Private archive configuration requires PRIVATE_ARCHIVE_PASSWORD and SUPABASE_SERVICE_ROLE_KEY together.",
    );
  }

  return { password, serviceRoleKey };
}

export function getOptionalGitHubEnrichmentConfig(environment: EnvironmentValues = process.env): GitHubEnrichmentConfig | null {
  const username = getConfiguredValue(environment, "GITHUB_USERNAME");
  if (!username) return null;

  return {
    username: username.trim(),
    token: getConfiguredValue(environment, "GITHUB_TOKEN"),
  };
}

const { EnvironmentConfigurationError } = require("./public-validation");

function getConfiguredValue(environment, name) {
  const value = environment[name];
  return value?.trim() ? value : undefined;
}

function requireAdminEmailAllowlist(environment = process.env) {
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

function getOptionalPrivateArchiveConfig(environment = process.env) {
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

function requirePrivateArchiveConfig(environment = process.env) {
  const configuration = getOptionalPrivateArchiveConfig(environment);
  if (!configuration) {
    throw new EnvironmentConfigurationError(
      "Private archive features require PRIVATE_ARCHIVE_PASSWORD and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return configuration;
}

function getOptionalGitHubEnrichmentConfig(environment = process.env) {
  const username = getConfiguredValue(environment, "GITHUB_USERNAME");
  if (!username) return null;

  return {
    username: username.trim(),
    token: getConfiguredValue(environment, "GITHUB_TOKEN"),
  };
}

module.exports = {
  getOptionalGitHubEnrichmentConfig,
  getOptionalPrivateArchiveConfig,
  requireAdminEmailAllowlist,
  requirePrivateArchiveConfig,
};

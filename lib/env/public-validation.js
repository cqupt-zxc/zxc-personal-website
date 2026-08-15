class EnvironmentConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "EnvironmentConfigurationError";
    this.code = "ENVIRONMENT_CONFIGURATION_ERROR";
  }
}

const localDevelopmentOrigin = "http://localhost:3001";

function getConfiguredValue(environment, name) {
  const value = environment[name];
  return value?.trim() ? value : undefined;
}

function parseSiteOrigin(value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new EnvironmentConfigurationError("NEXT_PUBLIC_SITE_URL must be a valid http:// or https:// site origin.");
  }

  const isAllowedProtocol = url.protocol === "http:" || url.protocol === "https:";
  const isOriginOnly = url.pathname === "/" && !url.search && !url.hash && !url.username && !url.password;

  if (!isAllowedProtocol || !isOriginOnly) {
    throw new EnvironmentConfigurationError("NEXT_PUBLIC_SITE_URL must contain only an http:// or https:// site origin.");
  }

  return url.origin;
}

function getSiteOrigin(environment = process.env) {
  const configuredOrigin = getConfiguredValue(environment, "NEXT_PUBLIC_SITE_URL");
  return configuredOrigin ? parseSiteOrigin(configuredOrigin) : localDevelopmentOrigin;
}

function isEnvironmentConfigurationError(error) {
  return Boolean(error && typeof error === "object" && error.code === "ENVIRONMENT_CONFIGURATION_ERROR");
}

function requireSiteOrigin(environment = process.env) {
  const configuredOrigin = getConfiguredValue(environment, "NEXT_PUBLIC_SITE_URL");
  if (!configuredOrigin) {
    throw new EnvironmentConfigurationError("OAuth-dependent features require NEXT_PUBLIC_SITE_URL.");
  }

  return parseSiteOrigin(configuredOrigin);
}

function getOptionalPublicSupabaseConfig(environment = process.env) {
  const url = getConfiguredValue(environment, "NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getConfiguredValue(environment, "NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url && !anonKey) return null;
  if (!url || !anonKey) {
    throw new EnvironmentConfigurationError(
      "Public Supabase configuration requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY together.",
    );
  }

  return { url, anonKey };
}

function requirePublicSupabaseConfig(environment = process.env) {
  const configuration = getOptionalPublicSupabaseConfig(environment);
  if (!configuration) {
    throw new EnvironmentConfigurationError(
      "Supabase-dependent features require NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return configuration;
}

module.exports = {
  EnvironmentConfigurationError,
  getOptionalPublicSupabaseConfig,
  getSiteOrigin,
  isEnvironmentConfigurationError,
  parseSiteOrigin,
  requirePublicSupabaseConfig,
  requireSiteOrigin,
};

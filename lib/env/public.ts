export type EnvironmentValues = Readonly<Record<string, string | undefined>>;

export type PublicSupabaseConfig = Readonly<{
  url: string;
  anonKey: string;
}>;

export class EnvironmentConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvironmentConfigurationError";
  }
}

const localDevelopmentOrigin = "http://localhost:3001";

function getConfiguredValue(environment: EnvironmentValues, name: string) {
  const value = environment[name];
  return value?.trim() ? value : undefined;
}

export function parseSiteOrigin(value: string) {
  let url: URL;

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

export function getSiteOrigin(environment: EnvironmentValues = process.env) {
  const configuredOrigin = getConfiguredValue(environment, "NEXT_PUBLIC_SITE_URL");
  return configuredOrigin ? parseSiteOrigin(configuredOrigin) : localDevelopmentOrigin;
}

export function getOptionalPublicSupabaseConfig(environment: EnvironmentValues = process.env): PublicSupabaseConfig | null {
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

export function requirePublicSupabaseConfig(environment: EnvironmentValues = process.env): PublicSupabaseConfig {
  const configuration = getOptionalPublicSupabaseConfig(environment);
  if (!configuration) {
    throw new EnvironmentConfigurationError(
      "Supabase-dependent features require NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return configuration;
}

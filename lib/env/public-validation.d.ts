export type EnvironmentValues = Readonly<Record<string, string | undefined>>;

export type PublicSupabaseConfig = Readonly<{
  url: string;
  anonKey: string;
}>;

export declare class EnvironmentConfigurationError extends Error {
  code: "ENVIRONMENT_CONFIGURATION_ERROR";
}
export declare function parseSiteOrigin(value: string): string;
export declare function getSiteOrigin(environment?: EnvironmentValues): string;
export declare function isEnvironmentConfigurationError(error: unknown): error is EnvironmentConfigurationError;
export declare function requireSiteOrigin(environment?: EnvironmentValues): string;
export declare function getOptionalPublicSupabaseConfig(environment?: EnvironmentValues): PublicSupabaseConfig | null;
export declare function requirePublicSupabaseConfig(environment?: EnvironmentValues): PublicSupabaseConfig;

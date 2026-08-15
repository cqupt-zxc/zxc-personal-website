import type { EnvironmentValues } from "./public-validation";

export type GitHubEnrichmentConfig = Readonly<{
  username: string;
  token: string | undefined;
}>;

export type PrivateArchiveConfig = Readonly<{
  password: string;
  serviceRoleKey: string;
}>;

export declare function requireAdminEmailAllowlist(environment?: EnvironmentValues): string[];
export declare function getOptionalPrivateArchiveConfig(environment?: EnvironmentValues): PrivateArchiveConfig | null;
export declare function requirePrivateArchiveConfig(environment?: EnvironmentValues): PrivateArchiveConfig;
export declare function getOptionalGitHubEnrichmentConfig(environment?: EnvironmentValues): GitHubEnrichmentConfig | null;

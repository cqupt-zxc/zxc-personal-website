import "server-only";

export {
  getOptionalGitHubEnrichmentConfig,
  getOptionalPrivateArchiveConfig,
  requireAdminEmailAllowlist,
  requirePrivateArchiveConfig,
} from "./server-validation";
export type { GitHubEnrichmentConfig, PrivateArchiveConfig } from "./server-validation";

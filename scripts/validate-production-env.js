const {
  isEnvironmentConfigurationError,
  requirePublicSupabaseConfig,
  requireSiteOrigin,
} = require("../lib/env/public-validation");
const {
  requireAdminEmailAllowlist,
  requirePrivateArchiveConfig,
} = require("../lib/env/server-validation");

try {
  requireSiteOrigin(process.env);
  requirePublicSupabaseConfig(process.env);
  requireAdminEmailAllowlist(process.env);
  requirePrivateArchiveConfig(process.env);
  console.log("Production environment validation passed.");
} catch (error) {
  if (isEnvironmentConfigurationError(error)) {
    console.error(`Production environment validation failed: ${error.message}`);
    process.exitCode = 1;
  } else {
    throw error;
  }
}

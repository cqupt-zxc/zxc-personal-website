export function getNextDistDir(nodeEnv: string | undefined) {
  return nodeEnv === "development" ? ".next-dev" : ".next";
}

export function normalizeSceneIndex(index: number, sceneCount: number) {
  if (sceneCount <= 0) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), sceneCount - 1);
}

export function formatSceneLabel(index: number, sceneCount: number) {
  const current = sceneCount <= 0 ? 0 : normalizeSceneIndex(index, sceneCount) + 1;
  return `${String(current).padStart(2, "0")} / ${String(sceneCount).padStart(2, "0")}`;
}

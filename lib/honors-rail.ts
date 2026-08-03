export function normalizeHonorIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((Math.trunc(index) % length) + length) % length;
}

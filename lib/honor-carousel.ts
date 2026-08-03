export function getNextHonorIndex(currentIndex: number, direction: -1 | 1, itemCount: number) {
  return itemCount === 0 ? 0 : (currentIndex + direction + itemCount) % itemCount;
}

export function getHonorPageLabel(index: number, itemCount: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(itemCount).padStart(2, "0")}`;
}

export function getHonorCardOffset(index: number, activeIndex: number, itemCount: number) {
  const distance = (index - activeIndex + itemCount) % itemCount;
  return distance > itemCount / 2 ? distance - itemCount : distance;
}

/** Returns array of indices to display in the sidebar according to capacity. */
export function computeVisibleIndices(total: number, capacity: number) {
  if (capacity >= total) return Array.from({length: total}, (_,i)=>i);
  if (total <= 2) return Array.from({length: total}, (_,i)=>i);
  // Reserve 2 for the last two stories and 1 slot for the ellipsis.
  const usable = Math.max(capacity - 3, 0);
  const head = Array.from({length: usable}, (_,i)=>i); // from 0 upward
  const tail = [total-2, total-1];
  // We'll render: head, ellipsis, tail
  return [...head, -1, ...tail]; // -1 means ellipsis
}

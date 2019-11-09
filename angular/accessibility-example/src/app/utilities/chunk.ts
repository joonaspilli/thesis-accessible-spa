/**
 * Chunk an array into multiple arrays.
 */
export const chunk = <T extends any[]>(array: T, chunkSize: number): T[] => {
  const chunked = [] as unknown as T;
  const length = array.length;
  let index = 0;
  while (index < length) {
    chunked.push(array.slice(index, chunkSize + index));
    index += chunkSize;
  }
  return chunked;
};

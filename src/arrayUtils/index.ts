/**
 * Push elements into the array and update the array immutably.
 * @param {T[]} array
 * @param {T} element
 * @param {T[]} rest
 * @returns {T[]}
 */
export const push = function <T>(array: T[], element: T, ...rest: T[]): T[] {
  const copy = [...array, element];
  if (rest.length) return [...copy, ...rest];
  return copy;
};

/**
 * Unshift the array immutably by adding new elements at the start of the array.
 * @param {T[]} array
 * @param {T} element
 * @param {T[]} rest
 * @returns {T[]}
 */
export const unshift = function <T>(array: T[], element: T, ...rest: T[]): T[] {
  const copy = [element, ...array];
  if (rest.length) return [...rest, ...copy];
  return copy;
};

/**
 * Shift the number of array elements specified by the offset immutably.
 * @param {T[]} array
 * @param {number} offset
 * @returns {T[]}
 */
export const shiftBy = function <T>(array: T[], offset: number = 1): T[] {
  const copy = [...array];
  return copy.slice(offset);
};

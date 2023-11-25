import { shiftBy } from "../arrayUtils/";

/**
 * Immutably set an object key with the specified value.
 * @param {T} object
 * @param {keyof T} key
 * @param {T[keyof T]} newValue
 * @returns {T}
 */
export const set = function <T>(
  object: T,
  key: keyof T,
  newValue: T[keyof T]
): T {
  const copy = { ...object };
  copy[key] = newValue;
  return copy;
};

/**
 * Immutably update an object.
 * @param {T} object
 * @param {K} key
 * @param {((value: T[K]) => T[K]) | T[K]} modify
 * @returns {T}
 */
export function update<T, K extends keyof T>(
  object: T,
  key: K,
  modify: T[K]
): T;
export function update<T, K extends keyof T>(
  object: T,
  key: K,
  modify: (value: T[K]) => T[K]
): T;
export function update<T, K extends keyof T>(
  object: T,
  key: K,
  modify: (value: T[K]) => T[K]
): T {
  const objectCopy = { ...object };
  if (typeof modify !== "function") return set(object, key, modify);
  const updatedValue = modify(objectCopy[key]);
  return set(object, key, updatedValue);
}

export const nestedUpdate = function <T, K extends keyof T>(
  object: T,
  keys: K[],
  modify: (value: T[K]) => T[K]
): T {
  // @ts-ignore
  if (keys.length === 0) return modify(object);
  const firstKey = keys[0];
  const remainingKeys = shiftBy(keys);

  // @ts-ignore
  return update(object, firstKey, (value) => {
    // @ts-ignore
    return nestedUpdate(value, remainingKeys, modify);
  });
};

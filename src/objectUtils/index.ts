import { shiftBy } from "../arrayUtils/";

/**
 * Immutably set an object key with the specified value.
 * @param {T} object
 * @param {keyof T} key
 * @param {T[keyof T]} newValue
 * @returns {T}
 */
export const set = function <T extends Object>(
  object: T,
  key: keyof T,
  newValue: T[keyof T]
): T {
  if (!object.hasOwnProperty(key)) throw new Error("Invalid object key.");
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
export function update<T extends Object, K extends keyof T>(
  object: T,
  key: K,
  modify: T[K]
): T;
export function update<T extends Object, K extends keyof T>(
  object: T,
  key: K,
  modify: (value: T[K]) => T[K]
): T;
export function update<T extends Object, K extends keyof T>(
  object: T,
  key: K,
  modify: (value: T[K]) => T[K]
): T {
  const objectCopy = { ...object };
  if (typeof modify !== "function") return set(object, key, modify);
  const updatedValue = modify(objectCopy[key]);
  return set(object, key, updatedValue);
}

/**
 * Immutably update deeply nested objects.
 * @param {T extends Object} object
 * @param {K[] | any} keys - Array of keys denoting the path to the nested value to be updated.
 * @param { ((value: T[K] | any) => T[K] | any) | T[K] | any} modify
 */
export function nestedUpdate<T extends Object, K extends keyof T>(
  object: T,
  keys: K[] | any,
  modify: T[K] | any
): T;
export function nestedUpdate<T extends Object, K extends keyof T>(
  object: T,
  keys: K[] | any,
  modify: (value: T[K] | any) => T[K] | any
): T {
  /**
   * If only one key is left and modify is not a function
   * return then update the object using the update function.
   */
  if (keys.length === 1 && typeof modify !== "function")
    return update(object, keys[0], modify);

  /**
   * If there are no keys remaining and modify is a function
   * then execute modify to modify the object which is now
   * a primitive value.
   */
  if (keys.length === 0 && typeof modify === "function")
    return modify(object as T[K]) as T;

  const firstKey = keys[0];
  const remainingKeys = shiftBy(keys);

  return update(object, firstKey, (value) => {
    return nestedUpdate(value as T, remainingKeys, modify) as T[K];
  });
}

export function omitFields<T extends Record<string, any>>(
  obj: T,
  fields: string[]
): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !fields.includes(key))
  ) as T;
}

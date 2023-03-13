export default function getMethods<T>(obj: T): (keyof T)[] {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)) && Object.getPrototypeOf(currentObj))
  return [...properties.keys()].filter(item => typeof obj[item as (keyof T)] === 'function' && item !== "constructor") as (keyof T)[]
}
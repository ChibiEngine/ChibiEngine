export default function getMethods<T extends object>(obj: T): (keyof T)[] {
  let properties = new Set()
  let currentObj = "prototype" in obj ? obj.prototype : Object.getPrototypeOf(obj)
  do {
    Object.getOwnPropertyNames(currentObj).forEach(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)) && Object.getPrototypeOf(currentObj))
  return [...properties.keys()].filter(item => item !== "constructor") as (keyof T)[]
}
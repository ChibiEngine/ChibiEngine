export default function getMethods<T>(obj: T): (keyof T)[] {
  let properties = new Set()
  let currentObj = Object.getPrototypeOf(obj)
  do {
    Object.getOwnPropertyNames(currentObj).forEach(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)) && Object.getPrototypeOf(currentObj))
  return [...properties.keys()].filter(item => item !== "constructor") as (keyof T)[]
}

export function getMethodsFromPrototype<T>(obj: T): (keyof T)[] {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).forEach(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)) && Object.getPrototypeOf(currentObj))
  return [...properties.keys()].filter(item => item !== "constructor") as (keyof T)[]
}
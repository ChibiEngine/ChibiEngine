export default function getProperties<T extends object>(obj: T): {[p: string]: PropertyDescriptor} {
  let properties: {[p: string]: PropertyDescriptor} = {}
  let currentObj = "prototype" in obj ? obj.prototype : Object.getPrototypeOf(obj)
  do {
    Object.getOwnPropertyNames(currentObj).forEach(item => properties[item] = Object.getOwnPropertyDescriptor(currentObj, item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)) && Object.getPrototypeOf(currentObj));
  for(const key in obj) {
    properties[key] = Object.getOwnPropertyDescriptor(obj, key)
  }
  delete properties.constructor;
  return properties
}
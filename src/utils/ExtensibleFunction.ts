/**
 * Base class for extensible functions
 */
export default class ExtensibleFunction extends Function {
  // @ts-ignore
  constructor(f) {
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}
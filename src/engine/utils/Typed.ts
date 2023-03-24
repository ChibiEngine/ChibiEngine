export type Class<T> = Function & { prototype: T };
export type ClassFull<T> = new (...args: any[]) => T;
export type ComponentClass<Base extends abstract new (...args: any[]) => any, T> = abstract new (...args: ConstructorParameters<Base>) => T;
export type NoInfer<T> = [T][T extends T ? 0 : never];

export interface Typed<T> {
  readonly targetType: Class<T>;
}

export function typesMatch<T>(instance: any, type: Class<T> | Typed<T>): boolean {
  if ('targetType' in type) {
    type = type.targetType;
  }
  return instance instanceof type;
}

export function assertTypesMatch<T>(instance: any, type: Class<T> | Typed<T>, message?: string) {
  if (!typesMatch(instance, type)) {
    throw new Error((message ? message + "\n" : "") + `Expected ${instance} to be of type ${type}`);
  }
}
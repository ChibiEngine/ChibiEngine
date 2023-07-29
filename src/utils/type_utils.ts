import Action from "../tween/Action";

export type Class<T> = abstract new (...args: any[]) => T;

export type ComponentClass<Base extends Class<any>, T> = abstract new (...args: ConstructorParameters<Base>) => T;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type ActionArrayType<T> = T extends Array<Action<infer U>> ? U : never;

export type MergeIntersection<T> =
    T extends [infer R, ...infer T1] ? R & MergeIntersection<T1> : {};

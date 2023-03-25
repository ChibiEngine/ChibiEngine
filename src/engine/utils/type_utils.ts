import Action from "../tween/Action";

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type ActionArrayType<T> = T extends Array<Action<infer U>> ? U : never;
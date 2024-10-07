export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type IsPrimitive<T> = T extends Primitive ? true : false;

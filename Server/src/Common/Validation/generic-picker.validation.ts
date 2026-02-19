import { Type } from '@nestjs/common';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';

type Constructor<T = any> = new (...args: any[]) => T;

interface IMultiFieldConfig<T, K extends keyof T = keyof T> {
  source: Type<T>;
  name: K;
  isRequired: boolean;
}

type ExtractDtoShape<T extends readonly IMultiFieldConfig<any, any>[]> =
  {
    [K in T[number] as K['name']]: K['source'] extends Type<infer S>
      ? K['name'] extends keyof S
        ? S[K['name']]
        : any
      : any;
  };

export function PickFromDtos<T extends readonly IMultiFieldConfig<any, any>[]>(
  configs: T,
): Type<ExtractDtoShape<T>> {
  const sourceMap = new Map<Type<any>, string[]>();

  configs.forEach((c) => {
    const fields = sourceMap.get(c.source) || [];
    fields.push(c.name as string);
    sourceMap.set(c.source, fields);
  });

  let CombinedBase: Constructor = class {};

  sourceMap.forEach((fields, SourceClass) => {
    const Picked = PickType(SourceClass, fields as any) as Constructor;
    CombinedBase = IntersectionType(CombinedBase, Picked) as Constructor;
  });

  abstract class GeneratedDto extends (CombinedBase as any) {}

  configs.forEach((config) => {
    const decorator = config.isRequired ? IsNotEmpty() : IsOptional();
    decorator(GeneratedDto.prototype, config.name as string);
  });

  return GeneratedDto as Type<ExtractDtoShape<T>>;
}

export function defineFields<T extends readonly IMultiFieldConfig<any, any>[]>(
  fields: {
    [K in keyof T]: IMultiFieldConfig<any, any> & {
      source: Type<any>;
      name: T[K] extends { source: Type<infer S> } ? keyof S : string;
    };
  } & T,
): T {
  return fields;
}

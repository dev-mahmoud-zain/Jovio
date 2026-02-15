import { Type } from '@nestjs/common';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';

type Constructor<T = any> = new (...args: any[]) => T;

export interface IMultiFieldConfig<T> {
  source: Type<T>;
  name: keyof T;
  isRequired: boolean;
}

export const configField = <T>(config: IMultiFieldConfig<T>) => config;

export function PickFromDtos(configs: IMultiFieldConfig<any>[]): Type<any> {
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

  abstract class GeneratedDto extends CombinedBase {}

  configs.forEach((config) => {
    const decorator = config.isRequired ? IsNotEmpty() : IsOptional();
    decorator(GeneratedDto.prototype, config.name as string);
  });

  return GeneratedDto as Type<any>;
}

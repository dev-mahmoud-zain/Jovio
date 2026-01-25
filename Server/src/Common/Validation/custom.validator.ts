import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'match-between-fields', async: false })
export class MatchBetweenFields implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [targetField] = args.constraints;
    return value === (args.object as any)[targetField];
  }

  defaultMessage(args: ValidationArguments) {
    const [targetField] = args.constraints;
    return `${args.property} Is Not Match With ${targetField}`;
  }
}

export function IsMatch(
  targetField: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsMatch',
      target: object.constructor,
      propertyName,
      constraints: [targetField],
      options: validationOptions,
      validator: MatchBetweenFields,
      
    });
  };
}
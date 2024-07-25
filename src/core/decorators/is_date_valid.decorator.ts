import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import {
    AllowDateFormat,
    ConvertToDate,
    IsBefore as IsBeforeEndTime,
    IsDateFormatValid,
    IsSameOrAfter,
} from 'helpers/date.helper';
export function IsDate(format: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return IsDateFormatValid(value, format);
                },
            },
        });
    };
}
export function IsGreaterThanStartDate(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsGreaterThanStartDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return IsSameOrAfter(value, relatedValue);
                },
            },
        });
    };
}

export function IsBefore(property: string, format: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsBefore',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property, format],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName, relatedFormat] = args.constraints;
                    const relatedPropertyValue = (args.object as any)[relatedPropertyName];

                    return IsBeforeEndTime(
                        ConvertToDate(value, relatedFormat),
                        ConvertToDate(relatedPropertyValue, relatedFormat),
                    );
                },
            },
        });
    };
}

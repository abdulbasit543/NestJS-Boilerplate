import { compare, genSalt, hash } from 'bcrypt-nodejs';
import AppConfig from 'configs/app.config';
import { OrderDirection } from 'core/request/paginated.request';
import * as gpc from 'generate-pincode';
import { v4 as uuid } from 'uuid';

export async function HashPassword(plainText: string): Promise<any> {
    return new Promise(function (resolve, reject) {
        genSalt(10, function (error, salt) {
            if (error) {
                reject(error);
            } else {
                hash(plainText, salt, null, function (error, hash) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
}

export async function ComparePassword(plainText, hash): Promise<any> {
    return new Promise(function (resolve, reject) {
        compare(plainText, hash, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

export interface PaginationRequestParams {
    Limit: number;
    Page?: number;
    Before?: number;
    After?: number;
}

export interface PaginationDBParams {
    Limit: number;
    Offset: number | string; // Offset as string would be Id for mongo before/after pagination
}

export interface OrderByRequestParams {
    Column: string;
    Direction: 'ASC' | 'DESC';
}

/**
 * Casts PaginationRequestParams to PaginationDBParams
 * @param {PaginationRequestParams} params
 * @returns {PaginationDBParams}
 */
// export function GetPaginationOptions(params: PaginationRequestParams) {
//     let options: PaginationDBParams = {
//         Limit: 20, //TODO: take this value to global constants or something
//         Offset: 0,
//     };
//     let Limit = params.Limit;
//     let Page = params.Page || 1;
//     let After = params.After;
//     let Before = params.Before;

//     if (Limit) {
//         options.Limit = parseInt(Limit.toString());
//     }

//     if (After) {
//         options.Offset = '+' + After;
//     } else if (Before) {
//         options.Offset = '-' + Before;
//     } else if (Page) {
//         options.Offset = options.Limit * Math.max(Page - 1, 0);
//     }
//     return options;
// }

// export function GetOrderByOptions(params: OrderByRequestParams) {
//     let Column = params.Column;
//     let Direction = params.Direction;
//     let options: OrderByRequestParams = {
//         Column: 'Id',
//         Direction: 'DESC',
//     };
//     if (Column) {
//         options.Column = Column;
//     }
//     if (Direction) {
//         options.Direction = Direction;
//     }
//     return options;
// }

/**
 * Casts Mongo's ObjectID instance to
 * @param value - Mongo's ObjectID instance
 * @returns {string}
 * @author Shahzaib Sheikh <shahzaib.sheikh@koderlabs.com>
 */
export function ObjectIdToHexString(value: any, obj): string {
    if (!Array.isArray(ObjectIdToHexString.prototype.hexTable)) {
        // Function cache is in use here
        ObjectIdToHexString.prototype.hexTable = [];
        for (let i = 0; i < 256; i++) {
            ObjectIdToHexString.prototype.hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16);
        }
    }

    const id =
        value && typeof value == 'object' && value.id
            ? Object.keys(value.id).map((key) => value.id[key])
            : [];

    let hexString = '';
    for (const el of id) {
        hexString += ObjectIdToHexString.prototype.hexTable[el];
    }
    return hexString;
}

export function SplitName(name) {
    let FullName = name.split(' ');
    let LastName = FullName.length > 1 ? FullName.pop() : null;
    let FirstName = FullName.join(' ');
    return { FirstName, LastName };
}

export function GetEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
}

export async function traverseObjectWithSearchKey(
    objOrArray: object | Array<object>,
    searchKeys: Array<String>,
    modifier: (val: object | Array<object> | string | number) => {},
) {
    if (!objOrArray) {
        return;
    }
    if (Array.isArray(objOrArray)) {
        for (let val of objOrArray) {
            await this.traverseObjectWithSearchKey(val, searchKeys, modifier);
        }
    } else if (typeof objOrArray === 'object') {
        let objectKeys = Object.keys(objOrArray);
        for (let key of objectKeys) {
            if (searchKeys.includes(key)) {
                objOrArray[key] = await modifier(objOrArray[key]);
            }
            await this.traverseObjectWithSearchKey(objOrArray[key], searchKeys, modifier);
        }
    }
}

export function SortObjectByKeys(data: any) {
    let orignalKeys = Object.keys(data);
    let sortedKeys = orignalKeys.sort();
    let obj = {};
    sortedKeys.forEach((key) => {
        obj[key] = data[key];
    });
    return obj;
}
export function IsAndroid(userAgent: string) {
    let result = false;
    let androidRegex = new RegExp(/android/i);

    if (androidRegex.test(userAgent)) {
        result = true;
    }
    return result;
}

export function ConvertVersionStringToFloatNumber(versionString) {
    return parseFloat(
        versionString.split('.')[0] + '.' + versionString.split('.').slice(1).join(''),
    );
}

export function ReplaceObjectValuesInString(text: string, obj = {}): string {
    for (const field in obj) {
        text = text.replace(new RegExp(`{{${field}}}`, 'g'), obj[field]);
    }
    return text;
}

export function GenerateVerificationCode(): string {
    return AppConfig.APP.DEBUG ? '0000' : gpc(4);
}

export function VerifyUniquePrimitiveArrayItems(array, length) {
    return new Set(array).size === length;
}

export function GenerateEnumDescriptionForSwagger(obj: Object): string {
    return Object.keys(obj)
        .map((key) => `${key} = ${obj[key]}`)
        .join(', ');
}

export function StringToBoolean(value: string) {
    if (typeof value === 'string') {
        return value.trim().toLowerCase() === 'true' ? true : false;
    }
    return value;
}

export function ConvertToTwoDecimalPlaces(number: number) {
    return Math.round(number * 100) / 100;
}

export function TruncateString(value: string, limit: number = 20) {
    return value.slice(0, limit) + '...';
}

export function GenerateUUID(): string {
    return uuid();
}

type GetPaginationOptionsArgs = {
    page?: number;
    limit?: number;
};

export function GetPaginationOptions(options: GetPaginationOptionsArgs) {
    const databaseOptions = {
        skip: 0,
        take: 10,
    };

    if (options.limit) {
        databaseOptions.take = options.limit;
    }

    if (options.page) {
        databaseOptions.skip = databaseOptions.take * Math.max(options.page - 1, 0);
    }

    return databaseOptions;
}

type GetOrderOptionsArgs = {
    column?: string;
    direction?: OrderDirection;
};

export function GetOrderOptions(options: GetOrderOptionsArgs) {
    let databaseOptions: any = {
        id: 'desc',
    };

    if (options.column && options.direction) {
        databaseOptions = {
            [options.column]: options.direction.toLowerCase(),
        };
    } else if (options.column) {
        databaseOptions = {
            [options.column]: 'asc',
        };
    }

    return databaseOptions;
}

export function ExcludeFields<T, Key extends keyof T>(model: T, keys: Key[]): Omit<T, Key> {
    for (const k of keys) delete model[k];

    return model;
}

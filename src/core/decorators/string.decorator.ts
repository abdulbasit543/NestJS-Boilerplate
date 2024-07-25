import { Transform } from 'class-transformer';

export function TrimString() {
    return Transform(({ value }) => (value && typeof value == 'string' ? value.trim() : value));
}

export function ParseToBoolean() {
    return Transform(({ value }) => (String(value).toLowerCase() === 'true' ? true : false));
}

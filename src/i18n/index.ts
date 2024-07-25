export class LocaleTranslation {
    private _key: string;
    private _locale: string;
    private _data?: Record<string, any>;

    private constructor(key: string, locale?: string, data?: Record<string, any>) {
        this._key = key;
        this._data = data;
        this._locale = locale || 'en';
    }

    static Create(key: string, data?: Record<string, any>, locale?: string): LocaleTranslation {
        return new LocaleTranslation(key, locale, data);
    }

    getKey(): string {
        return this._key;
    }

    getData(): Record<string, any> {
        return this._data;
    }

    getLocale(): string {
        return this._locale;
    }
}

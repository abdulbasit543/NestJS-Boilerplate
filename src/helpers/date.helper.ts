import * as moment from 'moment-timezone';

export enum AllowDateFormat {
    ISODate = 'YYYY-MM-DD',
    YearMonth = 'YYYY-MM',
    ShortDate = 'MM/DD/YYYY',
    LongDate = 'MMM DD YYYY',
    StringDate = 'YYYY-MM-DDTHH:mm:ss.sssZ',
    DateTime = 'YYYY-MM-DD HH:mm:ss',
    TimeWithOutSeconds = 'LT',
    TimeWithSeconds = 'LTS',
    DD = 'DD',
    MM = 'MM',
    YYYY = 'YYYY',
    YearWeek = 'GGGG-WW',
    Time24HourFormat = 'HH:mm',
    FullMonth = 'MMMM',
    UnixTimeStamp = 'x',
    WeekDay = 'dddd',
}

export function Now() {
    return moment().toDate();
}

export function ConvertDurationToSeconds(duration, unit: moment.DurationInputArg2 = 'minutes') {
    return moment.duration(duration, unit).asSeconds();
}

export function ToTimeStamp(date) {
    return moment(date).valueOf();
}

export function IsDateFormatValid(date, format) {
    return moment(date, format, true).isValid();
}

export function GetCurrentWeekDay() {
    return moment().format('dddd');
}

export function ConvertToDate(dateString: string, format: AllowDateFormat) {
    return moment(dateString, format).toDate();
}

export function IsSameOrAfter(firstDate, secondDate) {
    return moment(firstDate).isSameOrAfter(secondDate);
}

export function IsSameOrBefore(firstDate, secondDate) {
    return moment(firstDate).isSameOrBefore(secondDate);
}

export function IsSame(firstDate, secondDate) {
    return moment(firstDate).isSame(secondDate);
}

export function IsBefore(firstDate, secondDate) {
    return moment(firstDate).isBefore(secondDate);
}

export function ConvertToSpecificFormat(date: Date, format: AllowDateFormat) {
    return moment(date).format(format);
}

export function SubtractDays(date, days) {
    return moment(date).subtract(days, 'days').toDate();
}

export function AddDays(date, days) {
    return moment(date).add(days, 'days').toDate();
}

export function AddMonths(date, month) {
    return moment(date).add(month, 'month').toDate();
}

export function SubtractMonths(date, month) {
    return moment(date).subtract(month, 'month').toDate();
}

export function AddHours(date, hours) {
    return moment(date).add(hours, 'hour').toDate();
}

export function SubtractHours(date, hour) {
    return moment(date).subtract(24, 'hour').toDate();
}

export function DiffBetweenTwoDates(firstDate, secondDate) {
    return moment(secondDate).diff(moment(firstDate), 'days');
}

export function StartDateOfMonth(date) {
    return moment(date).startOf('month').toDate();
}

export function EndDateOfMonth(date) {
    return moment(date).endOf('month').toDate();
}

export function StartOfDay(date) {
    return moment(date).startOf('day').toDate();
}

export function EndOfDay(date) {
    return moment(date).endOf('day').toDate();
}

export function StartOfYear(date) {
    return moment(date).startOf('year').toDate();
}

export function EndOfYear(date) {
    return moment(date).endOf('year').toDate();
}

export function GetDate(date: Date) {
    return moment(date).date();
}

export function GetMonth(date: Date) {
    return moment(date).month();
}

export function GetYear(date: Date) {
    return moment(date).year();
}

export function GetMomentFromString(dateString, format: AllowDateFormat, tz = 'UTC') {
    return moment.tz(dateString, format, tz);
}

export function GetMomentFromTimezone(date: Date, tz) {
    return moment.tz(date, tz);
}

export function GetTimezoneDate(date: Date, tz) {
    return moment.tz(date, tz).toDate();
}

export function GetLastDayOfYear(year) {
    return moment(year, 'YYYY').endOf('year').toDate();
}

export function IsFuture(date: Date) {
    return moment(date).isAfter(moment());
}

export function getSeries(
    startDate: moment.Moment,
    endDate: moment.Moment,
    type: moment.unitOfTime.DurationConstructor,
): string[] {
    if (startDate.isSameOrAfter(endDate)) {
        throw new Error('Invalid date range supplied');
    }

    let series: string[] = [];
    let format: string = null;

    switch (type) {
        case 'year':
            format = AllowDateFormat.YYYY;
            break;
        case 'month':
            format = AllowDateFormat.YYYY + '-' + AllowDateFormat.MM;
            break;
        case 'week':
            format = 'gggg-ww';
            break;
        default:
            type = 'day';
            format = AllowDateFormat.YYYY + '-' + AllowDateFormat.MM + '-' + AllowDateFormat.DD;
    }

    while (true) {
        series.push(startDate.format(format));
        startDate = startDate.add(1, type as moment.unitOfTime.DurationConstructor);
        if (startDate.isAfter(endDate)) {
            break;
        }
    }
    return series;
}

export function getYearKeys(year) {
    let startDate = moment(year, AllowDateFormat.YYYY).startOf('year');
    let endDate = startDate.clone().endOf('year');
    let keys: string[] = getSeries(startDate, endDate, 'month');
    return keys;
}

export function generateLastXMonthKeys(today: moment.Moment, Months: number) {
    let endDate = today;
    let startDate = today.clone().subtract(Months - 1, 'months');
    let keys: string[] = getSeries(startDate, endDate, 'month');
    return keys;
}

export function generateWeekIntervalKeysBetweenTwoDates(startDate: Date, endDate: Date) {
    return getSeries(moment(startDate), moment(endDate), 'week');
}

export function generateDayIntervalKeys(endDate: moment.Moment, interval) {
    let startDate = endDate.clone().subtract(interval - 1, 'days');
    let keys: string[] = getSeries(startDate, endDate, 'day');
    return keys;
}

export function generateDayIntervalKeysBetweenTwoDates(startDate: Date, endDate: Date) {
    return getSeries(moment(startDate), moment(endDate), 'days');
}

/**
 * @function
 * @description returns range (start & end datetime) of previous Quarter of the hour or the datetime provided
 */
export function getPreviousQuarterHourRange(dateTime = moment()) {
    if (typeof dateTime === 'string') {
        dateTime = moment(dateTime, AllowDateFormat.DateTime);
    }

    let startTime = dateTime.clone().subtract(15, 'minutes');
    startTime.minutes(Math.floor(startTime.minutes() / 15) * 15);
    startTime.seconds(0);

    let endTime = startTime.clone();
    endTime.add(15, 'minutes').subtract(1, 'second');

    return {
        start: startTime,
        end: endTime,
    };
}

/**
 * @function
 * @description Get available timezones
 * @returns {string[]}
 */
export function getAvailableTimezones() {
    return moment.tz.names().filter((tz) => {
        let tzl = tz.toLowerCase();
        return tzl.indexOf('etc/') === -1 && tzl.indexOf('/') !== -1;
    });
}

/**
 * @function
 * @description Get timezones in which day is changed on the given utc date time
 * @returns {string[]}
 */
export function getDayChangedTimezones(dateTime: moment.Moment): string[] {
    let tzs: string[] = [];

    return getAvailableTimezones().filter((tz) => {
        let dt: moment.Moment = dateTime.clone();
        dt.tz(tz).set('seconds', 0);
        return dt.format('HH:mm:ss') == '00:00:00';
    });
}
/**
 * @function
 * @description Get timezones in which week is changed on the given utc date time
 * @returns {string[]}
 */
export function getWeekChangedTimezones(dateTime: moment.Moment): string[] {
    let tzs: string[] = [];

    return getDayChangedTimezones(dateTime).filter((tz) => {
        let dt: moment.Moment = dateTime.clone();
        dt.tz(tz).set('seconds', 0);
        let dt2 = dt.clone();
        dt2.subtract('second', 1);
        return dt.format(AllowDateFormat.YearWeek) != dt2.format(AllowDateFormat.YearWeek);
    });
}
/**
 * @function
 * @description Get timezones in which month is changed on the given utc date time
 * @returns {string[]}
 */
export function getMonthChangedTimezones(dateTime: moment.Moment): string[] {
    let tzs: string[] = [];

    return getDayChangedTimezones(dateTime).filter((tz) => {
        let dt: moment.Moment = dateTime.clone();
        dt.tz(tz).set('seconds', 0);
        let dt2 = dt.clone();
        dt2.subtract('seconds', 1);
        return dt.format(AllowDateFormat.YearMonth) != dt2.format(AllowDateFormat.YearMonth);
    });
}

export function ConvertMillisecondsToHour(time: number) {
    return (time / (1000 * 60 * 60)) % 24;
}

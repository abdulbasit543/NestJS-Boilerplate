import * as Chalk from 'chalk';
import AppConfig from 'configs/app.config';
import * as moment from 'moment-timezone';
import * as Morgan from 'morgan';
import { AllowDateFormat } from './date.helper';

export enum LogLevel {
    TRACE = 10,
    DEBUG = 20,
    INFO = 30,
    WARN = 40,
    ERROR = 50,
    FATAL = 60,
}

export class Logger {
    private static logTemplate = {
        [LogLevel.TRACE]: Chalk.greenBright,
        [LogLevel.DEBUG]: Chalk.whiteBright,
        [LogLevel.INFO]: Chalk.blueBright,
        [LogLevel.WARN]: Chalk.magenta,
        [LogLevel.ERROR]: Chalk.redBright,
        [LogLevel.FATAL]: Chalk.bgRed,
    };

    private static loggerMiddleware: Function = null;

    private static log(logLevel: LogLevel, data: any, tag?: string) {
        if (AppConfig.APP.LOG_LEVEL > logLevel) {
            return;
        }

        if (typeof data === 'object') {
            let str = JSON.stringify(data, null, 4);
            if (str != '{}') {
                data = str;
            }
        }

        let date = moment();
        if (tag !== undefined) {
            console.log(Chalk.bold.underline.white(tag), this.logTemplate[logLevel](data));
        } else {
            console.log(this.logTemplate[logLevel](data));
        }
    }

    public static Trace(data: any, tag?: string) {
        this.log(LogLevel.TRACE, data, tag);
    }
    public static Debug(data: any, tag?: string) {
        this.log(LogLevel.DEBUG, data, tag);
    }
    public static Info(data: any, tag?: string) {
        this.log(LogLevel.INFO, data, tag);
    }
    public static Warn(data: any, tag?: string) {
        this.log(LogLevel.WARN, data, tag);
    }
    public static Error(data: any, tag?: string) {
        this.log(LogLevel.ERROR, data, tag);
    }
    public static Fatal(data: any, tag?: string) {
        this.log(LogLevel.FATAL, data, tag);
    }

    public static GetLoggerMiddleware() {
        if (Logger.loggerMiddleware === null) {
            let LoggerFormatStr =
                ':date[iso] :method :status :response-time ms :res[content-length] :remote-addr :url :referrer :user-agent';

            if (AppConfig.APP.DEBUG) {
                Morgan.token('authorization', (req: any, res: any): string => {
                    return req.headers['authorization'] as string;
                });

                Morgan.token('body', (req: any, res: any) => {
                    return req.body ? JSON.stringify(req.body, null, 4) : '';
                });

                Morgan.token('query', (req: any, res: any): string => {
                    return req.query ? JSON.stringify(req.query, null, 4) : '';
                });

                Morgan.token('params', (req: any, res: any): string => {
                    return req.params ? JSON.stringify(req.params, null, 4) : '';
                });

                Morgan.token('responsebody', (req: any, res: any): string => {
                    let str = '';

                    if ((res as any).__ss_body) {
                        try {
                            // to avoid runtime exception for not json response
                            str = JSON.stringify((res as any).__ss_body, null, 4);
                        } catch (e) {
                            str = (res as any).__ss_body;
                        }
                    }
                    return str;
                });

                LoggerFormatStr =
                    '[API] :date[iso] :method :status :response-time ms :res[content-length] :remote-addr :url :referrer :user-agent\nPath Params :params\nQuery Params :query\nRequest Body :body\nResponse Body :responsebody';
            }

            Logger.loggerMiddleware = Morgan(LoggerFormatStr, {
                stream: {
                    write: (str) => {
                        this.Info(str);
                    },
                },
            });
        }

        return Logger.loggerMiddleware;
    }
}

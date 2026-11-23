export declare const LogLevel: {
    readonly Debug: 0;
    readonly Info: 1;
    readonly Warning: 2;
    readonly Error: 3;
    readonly Fatal: 4;
};
export type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];
export interface CloverLogger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
}
export type LogSink = (level: LogLevelValue, scope: string, message: string) => void;
export declare function makeLogger(sink: LogSink, scope: string): CloverLogger;

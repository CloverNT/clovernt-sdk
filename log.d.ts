import { type LogLevelValue } from "./bridge";
export interface CloverLogger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
}
export type LogSink = (level: LogLevelValue, scope: string, message: string) => void;
export declare function makeLogger(sink: LogSink, scope: string): CloverLogger;

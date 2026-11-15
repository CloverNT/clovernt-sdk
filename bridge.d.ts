import type { PluginManager } from "./clovernt.gen";
export declare const LogLevel: {
    readonly Debug: 0;
    readonly Info: 1;
    readonly Warning: 2;
    readonly Error: 3;
    readonly Fatal: 4;
};
export type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];
export type PluginInfo = ReturnType<PluginManager["list"]>[number];
export type PluginListing = ReturnType<PluginManager["scan"]>[number];
export interface LifecycleResult {
    ok: boolean;
    error?: string;
}
export interface LoaderConfig {
    id: string;
    load(name: string): LifecycleResult;
    unload(name: string): LifecycleResult;
    reload(name: string): LifecycleResult;
}

import * as electron from 'electron';
import { Session, OnHeadersReceivedListenerDetails, HeadersReceivedResponse } from 'electron';

declare enum Encryption {
    None = 0,
    D2Key = 1,
    ZeroKey = 2,
}
/**
 * Manages CloverNT plugins.
 */
declare class PluginManager {
    list(): PluginListing$1[];
    scan(): PluginScan[];
    load(name: string): boolean;
    unload(name: string): boolean;
    reload(name: string): boolean;
    registerLoader(id: string, config: object): boolean;
    unregisterLoader(id: string): boolean;
}
/**
 * Low-level QQNT SSO packet / o3 channel access. Byte payloads are Uint8Array.
 */
declare class PacketApi {
    ready(): boolean;
    credential(): Credential | undefined;
    send(command: string, body: Uint8Array): number | undefined;
    call(command: string, body: Uint8Array, timeoutMs: number): Packet | undefined;
    receive(command: string, timeoutMs: number): Packet | undefined;
    receiveSeq(seq: number, timeoutMs: number): Packet | undefined;
}
/**
 * A loaded plugin's entry points.
 */
declare class PluginListing$1 {
    readonly name: string;
    readonly main: string | undefined;
    readonly preload: string | undefined;
    readonly renderer: string | undefined;
}
/**
 * A discovered plugin (whether or not loaded).
 */
declare class PluginScan {
    readonly name: string;
    readonly type: string;
    readonly version: string | undefined;
    readonly author: string | undefined;
    readonly description: string | undefined;
    readonly passive: boolean;
    readonly loaded: boolean;
}
/**
 * A decoded SSO packet (body: decrypted payload for recv / plaintext for send).
 */
declare class Packet {
    readonly seq: number;
    readonly command: string;
    readonly uin: string;
    readonly encryption: Encryption;
    readonly body: Uint8Array;
}
/**
 * Captured session credentials.
 */
declare class Credential {
    readonly uin: string;
    readonly a2: Uint8Array;
    readonly d2: Uint8Array;
    readonly d2Key: Uint8Array;
}

type PluginInfo = ReturnType<PluginManager["list"]>[number];
type PluginListing = ReturnType<PluginManager["scan"]>[number];
interface LifecycleResult {
    ok: boolean;
    error?: string;
}
interface LoaderConfig {
    id: string;
    load(name: string): LifecycleResult;
    unload(name: string): LifecycleResult;
    reload(name: string): LifecycleResult;
}

interface CloverLogger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
}

interface Deasync {
    loopWhile(predicate: () => boolean): void;
    await<T>(promise: PromiseLike<T>): T;
}
interface DllLoadPayload {
    baseName: string;
    fullPath: string;
    baseAddress: string;
    imageSize: number;
}
/**
 * Event payloads arrive via the JSON event bridge, so byte fields are lowercase
 * hex strings (unlike the direct `clovernt.packet` API, which uses `Uint8Array`).
 */
interface PacketEventPayload {
    seq: number;
    command: string;
    uin: string;
    encryption: "none" | "d2key" | "zero" | string;
    body: string;
}
interface O3EventPayload {
    command: string;
    body: string;
}
interface CredentialEventPayload {
    uin: string;
    a2: string;
    d2: string;
    d2Key: string;
}
interface CloverEventMap {
    "dll-load": DllLoadPayload;
    "packet-send": PacketEventPayload;
    "packet-recv": PacketEventPayload;
    "o3-send": O3EventPayload;
    "o3-recv": O3EventPayload;
    "credential": CredentialEventPayload;
    [name: string]: unknown;
}
interface CloverEvents {
    on<K extends keyof CloverEventMap>(name: K, callback: (payload: CloverEventMap[K], control: {
        cancel(): void;
    }) => void): number;
    once<K extends keyof CloverEventMap>(name: K, callback: (payload: CloverEventMap[K]) => void): number;
    off(id: number): boolean;
    emit(name: string, payload?: unknown): boolean;
}
interface CloverApi {
    readonly version: string;
    readonly loaderVersion?: string;
    readonly coreDir?: string;
    readonly plugins?: PluginInfo[];
    readonly deasync?: Deasync;
    readonly events?: CloverEvents;
    readonly packet?: PacketApi;
    log(scope: string): CloverLogger;
    invoke?(channel: string, ...args: unknown[]): Promise<unknown>;
    send?(channel: string, ...args: unknown[]): void;
    on?(channel: string, callback: (...args: unknown[]) => void): void;
    registerLoader?(config: LoaderConfig): boolean;
    unregisterLoader?(id: string): boolean;
    loadPlugin?(name: string): boolean;
    unloadPlugin?(name: string): boolean;
    reloadPlugin?(name: string): boolean;
    rescan?(): number;
}
interface CloverContext {
    readonly name: string;
    readonly version: string;
    readonly loaderVersion: string;
    readonly coreDir: string;
    readonly plugins: PluginInfo[];
    readonly logger: CloverLogger;
    readonly events: CloverEvents;
    readonly packet: PacketApi;
    readonly electron: typeof electron;
    readonly app: {
        on(event: string, listener: (...args: any[]) => void): void;
    };
    readonly ipcMain: {
        on(channel: string, listener: (...args: any[]) => void): void;
        handle(channel: string, listener: (...args: any[]) => unknown): void;
    };
    onHeadersReceived(session: Session, listener: (details: OnHeadersReceivedListenerDetails, callback: (response: HeadersReceivedResponse) => void) => void): void;
    setTimeout(handler: (...args: any[]) => void, ms?: number, ...args: any[]): NodeJS.Timeout;
    setInterval(handler: (...args: any[]) => void, ms?: number, ...args: any[]): NodeJS.Timeout;
    onUnload(fn: () => void | Promise<void>): void;
}
type PluginEntry = ((ctx: CloverContext) => void | (() => void) | Promise<void>) | {
    onLoad(ctx: CloverContext): void | Promise<void>;
    onUnload?(): void | Promise<void>;
};
declare const clovernt: CloverApi;

export { type CloverApi, type CloverContext, type CloverEventMap, type CloverEvents, type CloverLogger, Credential, type CredentialEventPayload, type Deasync, type DllLoadPayload, Encryption, type LifecycleResult, type LoaderConfig, type O3EventPayload, Packet, PacketApi, type PacketEventPayload, type PluginEntry, type PluginInfo, type PluginListing, clovernt };

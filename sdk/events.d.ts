export interface DllLoadPayload {
    baseName: string;
    fullPath: string;
    baseAddress: string;
    imageSize: number;
}
export interface PacketEventPayload {
    seq: number;
    command: string;
    uin: string;
    uid: string;
    encryption: "none" | "d2key" | "zero";
    body: string;
    injected: boolean;
}
export interface O3EventPayload {
    command: string;
    body: string;
}
export interface CredentialEventPayload {
    uin: string;
    uid: string;
    a2: string;
    d2: string;
    d2Key: string;
}
export interface CloverEventMap {
    "dll-load": DllLoadPayload;
    "packet-send": PacketEventPayload;
    "packet-recv": PacketEventPayload;
    "o3-send": O3EventPayload;
    "o3-recv": O3EventPayload;
    "credential": CredentialEventPayload;
    [name: string]: unknown;
}
export declare const EventPriority: {
    readonly Lowest: 0;
    readonly Low: 1;
    readonly Normal: 2;
    readonly High: 3;
    readonly Highest: 4;
    readonly Monitor: 5;
};
export type EventPriorityValue = (typeof EventPriority)[keyof typeof EventPriority];
export interface CloverEvents {
    on<K extends keyof CloverEventMap>(name: K, callback: (payload: CloverEventMap[K], control: {
        cancel(): void;
    }) => void, priority?: EventPriorityValue): number;
    once<K extends keyof CloverEventMap>(name: K, callback: (payload: CloverEventMap[K]) => void, priority?: EventPriorityValue): number;
    off(id: number): boolean;
    emit(name: string, payload?: unknown): boolean;
}

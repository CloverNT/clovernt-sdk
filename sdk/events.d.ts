import type { CloverBuiltinEventName, CloverBuiltinEventSpecs, EventControl } from "../clovernt.gen";
export type { CloverBuiltinEventName, CloverBuiltinEventSpecs, EventControl };
export type ReadonlyEventContext = Omit<EventControl, "cancel">;
export type CancellableEventContext = EventControl;
export type CloverBuiltinEventMap = {
    [K in CloverBuiltinEventName]: CloverBuiltinEventSpecs[K]["args"];
};
export interface CloverEventMap extends CloverBuiltinEventMap {
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
export type EventArgsOf<T> = [T] extends [void] ? [] : T extends readonly unknown[] ? [...T] : [payload: T];
type ReadonlyPayload<T> = T extends (...args: any[]) => any ? T : T extends Uint8Array ? Readonly<Uint8Array> : T extends object ? {
    readonly [K in keyof T]: T[K];
} : T;
type ReadonlyTuple<Tuple extends readonly unknown[]> = Tuple extends readonly [infer Head, ...infer Tail] ? [ReadonlyPayload<Head>, ...ReadonlyTuple<Tail>] : Tuple extends readonly [] ? [] : Array<ReadonlyPayload<Tuple[number]>>;
export type MonitorEventArgsOf<T> = [T] extends [void] ? [] : T extends readonly unknown[] ? ReadonlyTuple<T> : [payload: ReadonlyPayload<T>];
export type EventContextFor<K, P extends EventPriorityValue> = P extends typeof EventPriority.Monitor ? ReadonlyEventContext : K extends CloverBuiltinEventName ? CloverBuiltinEventSpecs[K]["cancellable"] extends true ? CancellableEventContext : ReadonlyEventContext : CancellableEventContext;
type UntypedTopic<TName extends string> = [TName] extends [keyof CloverEventMap] ? never : TName;
type EmittablePluginTopic = Exclude<keyof CloverEventMap & string, CloverBuiltinEventName | `clovernt:${string}`>;
type UntypedEmittableTopic<TName extends string> = TName extends `clovernt:${string}` ? never : [TName] extends [keyof CloverEventMap] ? never : TName;
export interface CloverEvents {
    on<K extends keyof CloverEventMap, P extends EventPriorityValue = typeof EventPriority.Normal>(name: K, callback: (...args: [...EventArgsOf<CloverEventMap[K]>, ctx: EventContextFor<K, P>]) => unknown, priority?: P): number;
    on<TName extends string, P extends EventPriorityValue = typeof EventPriority.Normal>(name: UntypedTopic<TName>, callback: (...args: any[]) => unknown, priority?: P): number;
    once<K extends keyof CloverEventMap, P extends EventPriorityValue = typeof EventPriority.Normal>(name: K, callback: (...args: [...EventArgsOf<CloverEventMap[K]>, ctx: EventContextFor<K, P>]) => unknown, priority?: P): number;
    once<TName extends string, P extends EventPriorityValue = typeof EventPriority.Normal>(name: UntypedTopic<TName>, callback: (...args: any[]) => unknown, priority?: P): number;
    monitor<K extends keyof CloverEventMap>(name: K, callback: (...args: [...MonitorEventArgsOf<CloverEventMap[K]>, ctx: ReadonlyEventContext]) => unknown): number;
    monitor<TName extends string>(name: UntypedTopic<TName>, callback: (...args: any[]) => unknown): number;
    off(id: number): boolean;
    emit<K extends EmittablePluginTopic>(name: K, ...args: EventArgsOf<CloverEventMap[K]>): boolean;
    emit<TName extends string>(name: UntypedEmittableTopic<TName>, ...args: unknown[]): boolean;
}

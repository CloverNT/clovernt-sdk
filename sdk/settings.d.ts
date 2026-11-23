import type { SettingsPageConfig } from "../shared/settings";
export declare function registerSettingsPage(config: SettingsPageConfig): () => void;
export declare function unregisterSettingsPage(id: string): boolean;
export declare function openCloverSettings(target?: string): boolean;

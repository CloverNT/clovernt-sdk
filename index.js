'use strict';

// src/sdk/events.ts
var EventPriority = {
  Lowest: 0,
  Low: 1,
  Normal: 2,
  High: 3,
  Highest: 4,
  Monitor: 5
};

// src/sdk/plugin.ts
function definePlugin(plugin) {
  return plugin;
}

// src/sdk/runtime.ts
function runtime() {
  const api = globalThis.clovernt;
  if (!api) {
    throw new Error("@clovernt/sdk: the CloverNT runtime is not available (the `clovernt` global is missing)");
  }
  return api;
}
function proxy() {
  return new Proxy({}, {
    get: (_target, property) => runtime()[property]
  });
}
var clovernt = proxy();
var cloverntRenderer = proxy();

// src/sdk/settings.ts
function registerSettingsPage(config) {
  return cloverntRenderer.ui.registerSettingsPage(config);
}
function unregisterSettingsPage(id) {
  return cloverntRenderer.ui.unregisterSettingsPage(id);
}
function openCloverSettings(target) {
  return cloverntRenderer.ui.openSettings(target);
}

exports.EventPriority = EventPriority;
exports.clovernt = clovernt;
exports.cloverntRenderer = cloverntRenderer;
exports.definePlugin = definePlugin;
exports.openCloverSettings = openCloverSettings;
exports.registerSettingsPage = registerSettingsPage;
exports.unregisterSettingsPage = unregisterSettingsPage;

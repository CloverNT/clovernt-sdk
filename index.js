'use strict';

// src/sdk.ts
function runtime() {
  const api = globalThis.clovernt;
  if (!api) {
    throw new Error("@clovernt/sdk: the CloverNT runtime is not available (the `clovernt` global is missing)");
  }
  return api;
}
var clovernt = new Proxy({}, {
  get(_target, property) {
    return runtime()[property];
  }
});

exports.clovernt = clovernt;

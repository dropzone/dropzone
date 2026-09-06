import { vi } from "vitest";

// A minimal XMLHttpRequest double, replacing sinon/nise. It implements exactly
// the surface Dropzone uses (see src/dropzone.js) plus the fields the tests
// inspect: url, method, requestHeaders, responseHeaders, status, readyState.
//
// Tests drive responses by setting status/readyState/responseHeaders on a
// captured instance and calling onload() directly.
class FakeXMLHttpRequest {
  constructor() {
    this.readyState = 0;
    this.status = 0;
    this.statusText = "";
    this.responseText = "";
    this.response = "";
    this.responseType = "";
    this.withCredentials = false;
    this.timeout = 0;
    this.method = null;
    this.url = null;
    this.body = null;
    this.aborted = false;
    this.requestHeaders = {};
    this.responseHeaders = {};

    // Dropzone attaches progress handlers to xhr.upload.
    this.upload = {
      addEventListener: (type, fn) => (this.upload["on" + type] = fn),
      removeEventListener: (type) => delete this.upload["on" + type],
    };
  }

  open(method, url, async = true) {
    this.method = method;
    this.url = url;
    this.async = async;
    this.readyState = 1;
  }

  setRequestHeader(name, value) {
    this.requestHeaders[name] = value;
  }

  send(body) {
    this.body = body;
    this.sent = true;
  }

  abort() {
    this.aborted = true;
    this.readyState = 0;
  }

  getResponseHeader(name) {
    const key = Object.keys(this.responseHeaders).find(
      (k) => k.toLowerCase() === String(name).toLowerCase(),
    );
    return key === undefined ? null : this.responseHeaders[key];
  }

  getAllResponseHeaders() {
    return Object.entries(this.responseHeaders)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\r\n");
  }

  addEventListener(type, fn) {
    this["on" + type] = fn;
  }

  removeEventListener(type) {
    delete this["on" + type];
  }
}

// Swaps the global XMLHttpRequest for the duration of a test. Returns a handle
// whose `onCreate` fires for every request Dropzone opens, mirroring the API
// the suite previously got from sinon.
export function useFakeXMLHttpRequest() {
  const handle = {
    onCreate: null,
    restore: () => vi.unstubAllGlobals(),
  };

  class Captured extends FakeXMLHttpRequest {
    constructor() {
      super();
      handle.onCreate?.(this);
    }
  }

  vi.stubGlobal("XMLHttpRequest", Captured);
  return handle;
}

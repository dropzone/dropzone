// The Emitter class provides the ability to call `.on()` on Dropzone to listen
// to events.
// It is strongly based on component's emitter class, and I removed the
// functionality because of the dependency hell with different frameworks.
export default class Emitter {
  // Add an event listener for given event
  on(event, fn) {
    this._callbacks = this._callbacks || {};
    // Create namespace for this event
    if (!this._callbacks[event]) {
      this._callbacks[event] = [];
    }
    this._callbacks[event].push(fn);
    return this;
  }

  emit(event, ...args) {
    this._callbacks = this._callbacks || {};
    let callbacks = this._callbacks[event];

    if (callbacks) {
      for (let callback of callbacks) {
        callback.apply(this, args);
      }
    }
    // trigger a corresponding DOM event
    if (this.element) {
      this.element.dispatchEvent(this.makeEvent('dropzone:' + event, {args: args}));
    }
    return this;
  }

  makeEvent(eventName, detail) {
    // IE 11 support
    if (window.CustomEvent && typeof window.CustomEvent === 'function') {
      return new CustomEvent(eventName, {bubbles: true, cancelable: true, detail: detail});
    } else {
      let evt = getDocument().createEvent('CustomEvent');
      evt.initCustomEvent(eventName, true, true, detail);
      return evt;
    }
  }

  // Remove event listener for given event. If fn is not provided, all event
  // listeners for that event will be removed. If neither is provided, all
  // event listeners will be removed.
  off(event, fn) {
    if (!this._callbacks || arguments.length === 0) {
      this._callbacks = {};
      return this;
    }

    // specific event
    let callbacks = this._callbacks[event];
    if (!callbacks) {
      return this;
    }

    // remove all handlers
    if (arguments.length === 1) {
      delete this._callbacks[event];
      return this;
    }

    // remove specific handler
    for (let i = 0; i < callbacks.length; i++) {
      let callback = callbacks[i];
      if (callback === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }

    return this;
  }
}

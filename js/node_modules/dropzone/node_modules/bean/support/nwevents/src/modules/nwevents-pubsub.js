/*
 * Copyright (C) 2005-2011 Diego Perini
 * All rights reserved.
 *
 * PubSub extension for NWEvents
 *
 */

(function(global) {

  var doc = global.document,
  root = doc.documentElement,

  Event = typeof exports == 'object' ? exports : (
    (global.NW || (global.NW = { })) &&
    (global.NW.Event || (global.NW.Event = { }))),

  // event subscriptions register
  Subscriptions = { },

  /* =========================== TRIGGER HANDLERS =========================== */

  TRIGGER_EVENT = 'onhelp',

  triggerArguments = null,
  triggerCallback = null,
  triggerEnabled = false,

  triggerTarget = doc.createDocumentFragment &&
    doc.createDocumentFragment().
      appendChild(doc.createElement('div')),

  triggerEvent = Event.W3C_MODEL ?
    (function() {
      var event = doc.createEvent('Event');
      event.initEvent(TRIGGER_EVENT, true, true);
      return event;
    })() : Event.MSIE_MODEL ?
    (function() {
      var event = doc.createEventObject();
      event.type = 'onhelp';
      event.bubbles = true;
      event.cancelable = true;
      return event;
    })() :
    null,

  triggerEnable = Event.W3C_MODEL ?
    function(enable) {
      if ((triggerEnabled = !!enable)) {
        triggerTarget.addEventListener(TRIGGER_EVENT, triggerExec, false);
      } else {
        triggerTarget.removeEventListener(TRIGGER_EVENT, triggerExec, false);
      }
    } : Event.MSIE_MODEL ?
    function(enable) {
      if ((triggerEnabled = !!enable)) {
        triggerTarget.attachEvent(TRIGGER_EVENT, triggerExec);
      } else {
        triggerTarget.detachEvent(TRIGGER_EVENT, triggerExec);
      }
    } :
    function(enable) {
      triggerEnabled = !!enable;
    },

  triggerExec =
    function() {
      if (typeof triggerCallback == 'function') {
        triggerCallback.call(triggerArguments[0], triggerArguments[1]);
      }
    },

  trigger = Event.W3C_MODEL ?
    function(callback, args) {
      triggerArguments = args;
      triggerCallback = callback;
      triggerEvent.initEvent(TRIGGER_EVENT, true, true);
      triggerTarget.dispatchEvent(triggerEvent);
    } : Event.MSIE_MODEL ?
    function(callback, args) {
      triggerArguments = args;
      triggerCallback = callback;
      triggerEvent.bubbles = true;
      triggerEvent.cancelable = true;
      triggerTarget.fireEvent(TRIGGER_EVENT, triggerEvent);
    } :
    function(callback, args) {
      callback.call(args[0], args[1]);
    },

  // register a subscriber for event publication
  subscribe =
    function(object, type, callback, capture, options) {
      var k = Event.isRegistered(Subscriptions, object, type, callback, capture);
      if (k === false) Event.register(Subscriptions, object, type, callback, capture);
    },

  // unregister a subscriber from event publication
  unsubscribe =
    function(object, type, callback, capture, options) {
      var k = Event.isRegistered(Subscriptions, object, type, callback, capture);
      if (k !== false) Event.unregister(Subscriptions, object, type, callback, capture, k);
    },

  // publish an event to registered subscribers
  publish =
    function(object, type, data, capture, options) {
      var i, l, event, list = Subscriptions[type];
      if (list) {
        for (i = 0, l = list.calls.length; l > i; i++) {
          event = Event.synthesize(object, type, list.parms[i], options);
          if (data) event.data = data;
          event.currentTarget = list.items[i];
          if (triggerEnabled) {
            trigger(list.calls[i], [object, event]);
          } else {
            list.calls[i].call(object, event);
          }
        }
      }
    };

  // exposed methods
  Event.publish = publish;
  Event.subscribe = subscribe;
  Event.unsubscribe = unsubscribe;

  // control DOM events triggering
  Event.triggerEnable = triggerEnable;

  // event subscriptions collection
  Event.Subscriptions = Subscriptions;

  // enable DOM events triggering
  triggerEnable(true);

})(this);

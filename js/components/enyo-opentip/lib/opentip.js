/*
#
# Opentip v2.4.6
#
# More info at [www.opentip.org](http://www.opentip.org)
# 
# Copyright (c) 2012, Matias Meno  
# Graphics by Tjandra Mayerhold
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
*/

var Opentip, firstAdapter, i, mouseMoved, mousePosition, mousePositionObservers, position, vendors, _i, _len, _ref,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty;

Opentip = (function() {
  Opentip.prototype.STICKS_OUT_TOP = 1;

  Opentip.prototype.STICKS_OUT_BOTTOM = 2;

  Opentip.prototype.STICKS_OUT_LEFT = 1;

  Opentip.prototype.STICKS_OUT_RIGHT = 2;

  Opentip.prototype["class"] = {
    container: "opentip-container",
    opentip: "opentip",
    header: "ot-header",
    content: "ot-content",
    loadingIndicator: "ot-loading-indicator",
    close: "ot-close",
    goingToHide: "ot-going-to-hide",
    hidden: "ot-hidden",
    hiding: "ot-hiding",
    goingToShow: "ot-going-to-show",
    showing: "ot-showing",
    visible: "ot-visible",
    loading: "ot-loading",
    ajaxError: "ot-ajax-error",
    fixed: "ot-fixed",
    showEffectPrefix: "ot-show-effect-",
    hideEffectPrefix: "ot-hide-effect-",
    stylePrefix: "style-"
  };

  function Opentip(element, content, title, options) {
    var elementsOpentips, hideTrigger, methodToBind, optionSources, prop, styleName, _i, _j, _len, _len1, _ref, _ref1, _ref2, _tmpStyle,
      _this = this;

    this.id = ++Opentip.lastId;
    this.debug("Creating Opentip.");
    Opentip.tips.push(this);
    this.adapter = Opentip.adapter;
    elementsOpentips = this.adapter.data(element, "opentips") || [];
    elementsOpentips.push(this);
    this.adapter.data(element, "opentips", elementsOpentips);
    this.triggerElement = this.adapter.wrap(element);
    if (this.triggerElement.length > 1) {
      throw new Error("You can't call Opentip on multiple elements.");
    }
    if (this.triggerElement.length < 1) {
      throw new Error("Invalid element.");
    }
    this.loaded = false;
    this.loading = false;
    this.visible = false;
    this.waitingToShow = false;
    this.waitingToHide = false;
    this.currentPosition = {
      left: 0,
      top: 0
    };
    this.dimensions = {
      width: 100,
      height: 50
    };
    this.content = "";
    this.redraw = true;
    this.currentObservers = {
      showing: false,
      visible: false,
      hiding: false,
      hidden: false
    };
    options = this.adapter.clone(options);
    if (typeof content === "object") {
      options = content;
      content = title = void 0;
    } else if (typeof title === "object") {
      options = title;
      title = void 0;
    }
    if (title != null) {
      options.title = title;
    }
    if (content != null) {
      this.setContent(content);
    }
    if (options["extends"] == null) {
      if (options.style != null) {
        options["extends"] = options.style;
      } else {
        options["extends"] = Opentip.defaultStyle;
      }
    }
    optionSources = [options];
    _tmpStyle = options;
    while (_tmpStyle["extends"]) {
      styleName = _tmpStyle["extends"];
      _tmpStyle = Opentip.styles[styleName];
      if (_tmpStyle == null) {
        throw new Error("Invalid style: " + styleName);
      }
      optionSources.unshift(_tmpStyle);
      if (!((_tmpStyle["extends"] != null) || styleName === "standard")) {
        _tmpStyle["extends"] = "standard";
      }
    }
    options = (_ref = this.adapter).extend.apply(_ref, [{}].concat(__slice.call(optionSources)));
    options.hideTriggers = (function() {
      var _i, _len, _ref1, _results;

      _ref1 = options.hideTriggers;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        hideTrigger = _ref1[_i];
        _results.push(hideTrigger);
      }
      return _results;
    })();
    if (options.hideTrigger && options.hideTriggers.length === 0) {
      options.hideTriggers.push(options.hideTrigger);
    }
    _ref1 = ["tipJoint", "targetJoint", "stem"];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      prop = _ref1[_i];
      if (options[prop] && typeof options[prop] === "string") {
        options[prop] = new Opentip.Joint(options[prop]);
      }
    }
    if (options.ajax && (options.ajax === true || !options.ajax)) {
      if (this.adapter.tagName(this.triggerElement) === "A") {
        options.ajax = this.adapter.attr(this.triggerElement, "href");
      } else {
        options.ajax = false;
      }
    }
    if (options.showOn === "click" && this.adapter.tagName(this.triggerElement) === "A") {
      this.adapter.observe(this.triggerElement, "click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        return e.stopped = true;
      });
    }
    if (options.target) {
      options.fixed = true;
    }
    if (options.stem === true) {
      options.stem = new Opentip.Joint(options.tipJoint);
    }
    if (options.target === true) {
      options.target = this.triggerElement;
    } else if (options.target) {
      options.target = this.adapter.wrap(options.target);
    }
    this.currentStem = options.stem;
    if (options.delay == null) {
      options.delay = options.showOn === "mouseover" ? 0.2 : 0;
    }
    if (options.targetJoint == null) {
      options.targetJoint = new Opentip.Joint(options.tipJoint).flip();
    }
    this.showTriggers = [];
    this.showTriggersWhenVisible = [];
    this.hideTriggers = [];
    if (options.showOn && options.showOn !== "creation") {
      this.showTriggers.push({
        element: this.triggerElement,
        event: options.showOn
      });
    }
    if (options.ajaxCache != null) {
      options.cache = options.ajaxCache;
      delete options.ajaxCache;
    }
    this.options = options;
    this.bound = {};
    _ref2 = ["prepareToShow", "prepareToHide", "show", "hide", "reposition"];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      methodToBind = _ref2[_j];
      this.bound[methodToBind] = (function(methodToBind) {
        return function() {
          return _this[methodToBind].apply(_this, arguments);
        };
      })(methodToBind);
    }
    this.adapter.domReady(function() {
      _this.activate();
      if (_this.options.showOn === "creation") {
        return _this.prepareToShow();
      }
    });
  }

  Opentip.prototype._setup = function() {
    var hideOn, hideTrigger, hideTriggerElement, i, _i, _j, _len, _len1, _ref, _ref1, _results;

    this.debug("Setting up the tooltip.");
    this._buildContainer();
    this.hideTriggers = [];
    _ref = this.options.hideTriggers;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      hideTrigger = _ref[i];
      hideTriggerElement = null;
      hideOn = this.options.hideOn instanceof Array ? this.options.hideOn[i] : this.options.hideOn;
      if (typeof hideTrigger === "string") {
        switch (hideTrigger) {
          case "trigger":
            hideOn = hideOn || "mouseout";
            hideTriggerElement = this.triggerElement;
            break;
          case "tip":
            hideOn = hideOn || "mouseover";
            hideTriggerElement = this.container;
            break;
          case "target":
            hideOn = hideOn || "mouseover";
            hideTriggerElement = this.options.target;
            break;
          case "closeButton":
            break;
          default:
            throw new Error("Unknown hide trigger: " + hideTrigger + ".");
        }
      } else {
        hideOn = hideOn || "mouseover";
        hideTriggerElement = this.adapter.wrap(hideTrigger);
      }
      if (hideTriggerElement) {
        this.hideTriggers.push({
          element: hideTriggerElement,
          event: hideOn,
          original: hideTrigger
        });
      }
    }
    _ref1 = this.hideTriggers;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      hideTrigger = _ref1[_j];
      _results.push(this.showTriggersWhenVisible.push({
        element: hideTrigger.element,
        event: "mouseover"
      }));
    }
    return _results;
  };

  Opentip.prototype._buildContainer = function() {
    this.container = this.adapter.create("<div id=\"opentip-" + this.id + "\" class=\"" + this["class"].container + " " + this["class"].hidden + " " + this["class"].stylePrefix + this.options.className + "\"></div>");
    this.adapter.css(this.container, {
      position: "absolute"
    });
    if (this.options.ajax) {
      this.adapter.addClass(this.container, this["class"].loading);
    }
    if (this.options.fixed) {
      this.adapter.addClass(this.container, this["class"].fixed);
    }
    if (this.options.showEffect) {
      this.adapter.addClass(this.container, "" + this["class"].showEffectPrefix + this.options.showEffect);
    }
    if (this.options.hideEffect) {
      return this.adapter.addClass(this.container, "" + this["class"].hideEffectPrefix + this.options.hideEffect);
    }
  };

  Opentip.prototype._buildElements = function() {
    var headerElement, titleElement;

    this.tooltipElement = this.adapter.create("<div class=\"" + this["class"].opentip + "\"><div class=\"" + this["class"].header + "\"></div><div class=\"" + this["class"].content + "\"></div></div>");
    this.backgroundCanvas = this.adapter.wrap(document.createElement("canvas"));
    this.adapter.css(this.backgroundCanvas, {
      position: "absolute"
    });
    if (typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager !== null) {
      G_vmlCanvasManager.initElement(this.adapter.unwrap(this.backgroundCanvas));
    }
    headerElement = this.adapter.find(this.tooltipElement, "." + this["class"].header);
    if (this.options.title) {
      titleElement = this.adapter.create("<h1></h1>");
      this.adapter.update(titleElement, this.options.title, this.options.escapeTitle);
      this.adapter.append(headerElement, titleElement);
    }
    if (this.options.ajax && !this.loaded) {
      this.adapter.append(this.tooltipElement, this.adapter.create("<div class=\"" + this["class"].loadingIndicator + "\"><span>↻</span></div>"));
    }
    if (__indexOf.call(this.options.hideTriggers, "closeButton") >= 0) {
      this.closeButtonElement = this.adapter.create("<a href=\"javascript:undefined;\" class=\"" + this["class"].close + "\"><span>Close</span></a>");
      this.adapter.append(headerElement, this.closeButtonElement);
    }
    this.adapter.append(this.container, this.backgroundCanvas);
    this.adapter.append(this.container, this.tooltipElement);
    this.adapter.append(document.body, this.container);
    this._newContent = true;
    return this.redraw = true;
  };

  Opentip.prototype.setContent = function(content) {
    this.content = content;
    this._newContent = true;
    if (typeof this.content === "function") {
      this._contentFunction = this.content;
      this.content = "";
    } else {
      this._contentFunction = null;
    }
    if (this.visible) {
      return this._updateElementContent();
    }
  };

  Opentip.prototype._updateElementContent = function() {
    var contentDiv;

    if (this._newContent || (!this.options.cache && this._contentFunction)) {
      contentDiv = this.adapter.find(this.container, "." + this["class"].content);
      if (contentDiv != null) {
        if (this._contentFunction) {
          this.debug("Executing content function.");
          this.content = this._contentFunction(this);
        }
        this.adapter.update(contentDiv, this.content, this.options.escapeContent);
      }
      this._newContent = false;
    }
    this._storeAndLockDimensions();
    return this.reposition();
  };

  Opentip.prototype._storeAndLockDimensions = function() {
    var prevDimension;

    if (!this.container) {
      return;
    }
    prevDimension = this.dimensions;
    this.adapter.css(this.container, {
      width: "auto",
      left: "0px",
      top: "0px"
    });
    this.dimensions = this.adapter.dimensions(this.container);
    this.dimensions.width += 1;
    this.adapter.css(this.container, {
      width: "" + this.dimensions.width + "px",
      top: "" + this.currentPosition.top + "px",
      left: "" + this.currentPosition.left + "px"
    });
    if (!this._dimensionsEqual(this.dimensions, prevDimension)) {
      this.redraw = true;
      return this._draw();
    }
  };

  Opentip.prototype.activate = function() {
    return this._setupObservers("hidden", "hiding");
  };

  Opentip.prototype.deactivate = function() {
    this.debug("Deactivating tooltip.");
    this.hide();
    return this._setupObservers("-showing", "-visible", "-hidden", "-hiding");
  };

  Opentip.prototype._setupObservers = function() {
    var observeOrStop, removeObserver, state, states, trigger, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2,
      _this = this;

    states = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = states.length; _i < _len; _i++) {
      state = states[_i];
      removeObserver = false;
      if (state.charAt(0) === "-") {
        removeObserver = true;
        state = state.substr(1);
      }
      if (this.currentObservers[state] === !removeObserver) {
        continue;
      }
      this.currentObservers[state] = !removeObserver;
      observeOrStop = function() {
        var args, _ref, _ref1;

        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (removeObserver) {
          return (_ref = _this.adapter).stopObserving.apply(_ref, args);
        } else {
          return (_ref1 = _this.adapter).observe.apply(_ref1, args);
        }
      };
      switch (state) {
        case "showing":
          _ref = this.hideTriggers;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            trigger = _ref[_j];
            observeOrStop(trigger.element, trigger.event, this.bound.prepareToHide);
          }
          observeOrStop((document.onresize != null ? document : window), "resize", this.bound.reposition);
          observeOrStop(window, "scroll", this.bound.reposition);
          break;
        case "visible":
          _ref1 = this.showTriggersWhenVisible;
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            trigger = _ref1[_k];
            observeOrStop(trigger.element, trigger.event, this.bound.prepareToShow);
          }
          break;
        case "hiding":
          _ref2 = this.showTriggers;
          for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
            trigger = _ref2[_l];
            observeOrStop(trigger.element, trigger.event, this.bound.prepareToShow);
          }
          break;
        case "hidden":
          break;
        default:
          throw new Error("Unknown state: " + state);
      }
    }
    return null;
  };

  Opentip.prototype.prepareToShow = function() {
    this._abortHiding();
    this._abortShowing();
    if (this.visible) {
      return;
    }
    this.debug("Showing in " + this.options.delay + "s.");
    if (this.container == null) {
      this._setup();
    }
    if (this.options.group) {
      Opentip._abortShowingGroup(this.options.group, this);
    }
    this.preparingToShow = true;
    this._setupObservers("-hidden", "-hiding", "showing");
    this._followMousePosition();
    if (this.options.fixed && !this.options.target) {
      this.initialMousePosition = mousePosition;
    }
    this.reposition();
    return this._showTimeoutId = this.setTimeout(this.bound.show, this.options.delay || 0);
  };

  Opentip.prototype.show = function() {
    var _this = this;

    this._abortHiding();
    if (this.visible) {
      return;
    }
    this._clearTimeouts();
    if (!this._triggerElementExists()) {
      return this.deactivate();
    }
    this.debug("Showing now.");
    if (this.container == null) {
      this._setup();
    }
    if (this.options.group) {
      Opentip._hideGroup(this.options.group, this);
    }
    this.visible = true;
    this.preparingToShow = false;
    if (this.tooltipElement == null) {
      this._buildElements();
    }
    this._updateElementContent();
    if (this.options.ajax && (!this.loaded || !this.options.cache)) {
      this._loadAjax();
    }
    this._searchAndActivateCloseButtons();
    this._startEnsureTriggerElement();
    this.adapter.css(this.container, {
      zIndex: Opentip.lastZIndex++
    });
    this._setupObservers("-hidden", "-hiding", "-showing", "-visible", "showing", "visible");
    if (this.options.fixed && !this.options.target) {
      this.initialMousePosition = mousePosition;
    }
    this.reposition();
    this.adapter.removeClass(this.container, this["class"].hiding);
    this.adapter.removeClass(this.container, this["class"].hidden);
    this.adapter.addClass(this.container, this["class"].goingToShow);
    this.setCss3Style(this.container, {
      transitionDuration: "0s"
    });
    this.defer(function() {
      var delay;

      if (!_this.visible || _this.preparingToHide) {
        return;
      }
      _this.adapter.removeClass(_this.container, _this["class"].goingToShow);
      _this.adapter.addClass(_this.container, _this["class"].showing);
      delay = 0;
      if (_this.options.showEffect && _this.options.showEffectDuration) {
        delay = _this.options.showEffectDuration;
      }
      _this.setCss3Style(_this.container, {
        transitionDuration: "" + delay + "s"
      });
      _this._visibilityStateTimeoutId = _this.setTimeout(function() {
        _this.adapter.removeClass(_this.container, _this["class"].showing);
        return _this.adapter.addClass(_this.container, _this["class"].visible);
      }, delay);
      return _this._activateFirstInput();
    });
    return this._draw();
  };

  Opentip.prototype._abortShowing = function() {
    if (this.preparingToShow) {
      this.debug("Aborting showing.");
      this._clearTimeouts();
      this._stopFollowingMousePosition();
      this.preparingToShow = false;
      return this._setupObservers("-showing", "-visible", "hiding", "hidden");
    }
  };

  Opentip.prototype.prepareToHide = function() {
    this._abortShowing();
    this._abortHiding();
    if (!this.visible) {
      return;
    }
    this.debug("Hiding in " + this.options.hideDelay + "s");
    this.preparingToHide = true;
    this._setupObservers("-showing", "visible", "-hidden", "hiding");
    return this._hideTimeoutId = this.setTimeout(this.bound.hide, this.options.hideDelay);
  };

  Opentip.prototype.hide = function() {
    var _this = this;

    this._abortShowing();
    if (!this.visible) {
      return;
    }
    this._clearTimeouts();
    this.debug("Hiding!");
    this.visible = false;
    this.preparingToHide = false;
    this._stopEnsureTriggerElement();
    this._setupObservers("-showing", "-visible", "-hiding", "-hidden", "hiding", "hidden");
    if (!this.options.fixed) {
      this._stopFollowingMousePosition();
    }
    if (!this.container) {
      return;
    }
    this.adapter.removeClass(this.container, this["class"].visible);
    this.adapter.removeClass(this.container, this["class"].showing);
    this.adapter.addClass(this.container, this["class"].goingToHide);
    this.setCss3Style(this.container, {
      transitionDuration: "0s"
    });
    return this.defer(function() {
      var hideDelay;

      _this.adapter.removeClass(_this.container, _this["class"].goingToHide);
      _this.adapter.addClass(_this.container, _this["class"].hiding);
      hideDelay = 0;
      if (_this.options.hideEffect && _this.options.hideEffectDuration) {
        hideDelay = _this.options.hideEffectDuration;
      }
      _this.setCss3Style(_this.container, {
        transitionDuration: "" + hideDelay + "s"
      });
      return _this._visibilityStateTimeoutId = _this.setTimeout(function() {
        _this.adapter.removeClass(_this.container, _this["class"].hiding);
        _this.adapter.addClass(_this.container, _this["class"].hidden);
        _this.setCss3Style(_this.container, {
          transitionDuration: "0s"
        });
        if (_this.options.removeElementsOnHide) {
          _this.debug("Removing HTML elements.");
          _this.adapter.remove(_this.container);
          delete _this.container;
          return delete _this.tooltipElement;
        }
      }, hideDelay);
    });
  };

  Opentip.prototype._abortHiding = function() {
    if (this.preparingToHide) {
      this.debug("Aborting hiding.");
      this._clearTimeouts();
      this.preparingToHide = false;
      return this._setupObservers("-hiding", "showing", "visible");
    }
  };

  Opentip.prototype.reposition = function() {
    var position, stem, _ref,
      _this = this;

    position = this.getPosition();
    if (position == null) {
      return;
    }
    stem = this.options.stem;
    if (this.options.containInViewport) {
      _ref = this._ensureViewportContainment(position), position = _ref.position, stem = _ref.stem;
    }
    if (this._positionsEqual(position, this.currentPosition)) {
      return;
    }
    if (!(!this.options.stem || stem.eql(this.currentStem))) {
      this.redraw = true;
    }
    this.currentPosition = position;
    this.currentStem = stem;
    this._draw();
    this.adapter.css(this.container, {
      left: "" + position.left + "px",
      top: "" + position.top + "px"
    });
    return this.defer(function() {
      var rawContainer, redrawFix;

      rawContainer = _this.adapter.unwrap(_this.container);
      rawContainer.style.visibility = "hidden";
      redrawFix = rawContainer.offsetHeight;
      return rawContainer.style.visibility = "visible";
    });
  };

  Opentip.prototype.getPosition = function(tipJoint, targetJoint, stem) {
    var additionalHorizontal, additionalVertical, offsetDistance, position, stemLength, targetDimensions, targetPosition, unwrappedTarget, _ref;

    if (!this.container) {
      return;
    }
    if (tipJoint == null) {
      tipJoint = this.options.tipJoint;
    }
    if (targetJoint == null) {
      targetJoint = this.options.targetJoint;
    }
    position = {};
    if (this.options.target) {
      targetPosition = this.adapter.offset(this.options.target);
      targetDimensions = this.adapter.dimensions(this.options.target);
      position = targetPosition;
      if (targetJoint.right) {
        unwrappedTarget = this.adapter.unwrap(this.options.target);
        if (unwrappedTarget.getBoundingClientRect != null) {
          position.left = unwrappedTarget.getBoundingClientRect().right + ((_ref = window.pageXOffset) != null ? _ref : document.body.scrollLeft);
        } else {
          position.left += targetDimensions.width;
        }
      } else if (targetJoint.center) {
        position.left += Math.round(targetDimensions.width / 2);
      }
      if (targetJoint.bottom) {
        position.top += targetDimensions.height;
      } else if (targetJoint.middle) {
        position.top += Math.round(targetDimensions.height / 2);
      }
      if (this.options.borderWidth) {
        if (this.options.tipJoint.left) {
          position.left += this.options.borderWidth;
        }
        if (this.options.tipJoint.right) {
          position.left -= this.options.borderWidth;
        }
        if (this.options.tipJoint.top) {
          position.top += this.options.borderWidth;
        } else if (this.options.tipJoint.bottom) {
          position.top -= this.options.borderWidth;
        }
      }
    } else {
      if (this.initialMousePosition) {
        position = {
          top: this.initialMousePosition.y,
          left: this.initialMousePosition.x
        };
      } else {
        position = {
          top: mousePosition.y,
          left: mousePosition.x
        };
      }
    }
    if (this.options.autoOffset) {
      stemLength = this.options.stem ? this.options.stemLength : 0;
      offsetDistance = stemLength && this.options.fixed ? 2 : 10;
      additionalHorizontal = tipJoint.middle && !this.options.fixed ? 15 : 0;
      additionalVertical = tipJoint.center && !this.options.fixed ? 15 : 0;
      if (tipJoint.right) {
        position.left -= offsetDistance + additionalHorizontal;
      } else if (tipJoint.left) {
        position.left += offsetDistance + additionalHorizontal;
      }
      if (tipJoint.bottom) {
        position.top -= offsetDistance + additionalVertical;
      } else if (tipJoint.top) {
        position.top += offsetDistance + additionalVertical;
      }
      if (stemLength) {
        if (stem == null) {
          stem = this.options.stem;
        }
        if (stem.right) {
          position.left -= stemLength;
        } else if (stem.left) {
          position.left += stemLength;
        }
        if (stem.bottom) {
          position.top -= stemLength;
        } else if (stem.top) {
          position.top += stemLength;
        }
      }
    }
    position.left += this.options.offset[0];
    position.top += this.options.offset[1];
    if (tipJoint.right) {
      position.left -= this.dimensions.width;
    } else if (tipJoint.center) {
      position.left -= Math.round(this.dimensions.width / 2);
    }
    if (tipJoint.bottom) {
      position.top -= this.dimensions.height;
    } else if (tipJoint.middle) {
      position.top -= Math.round(this.dimensions.height / 2);
    }
    return position;
  };

  Opentip.prototype._ensureViewportContainment = function(position) {
    var needsRepositioning, newSticksOut, originals, revertedX, revertedY, scrollOffset, stem, sticksOut, targetJoint, tipJoint, viewportDimensions, viewportPosition;

    stem = this.options.stem;
    originals = {
      position: position,
      stem: stem
    };
    if (!(this.visible && position)) {
      return originals;
    }
    sticksOut = this._sticksOut(position);
    if (!(sticksOut[0] || sticksOut[1])) {
      return originals;
    }
    tipJoint = new Opentip.Joint(this.options.tipJoint);
    if (this.options.targetJoint) {
      targetJoint = new Opentip.Joint(this.options.targetJoint);
    }
    scrollOffset = this.adapter.scrollOffset();
    viewportDimensions = this.adapter.viewportDimensions();
    viewportPosition = [position.left - scrollOffset[0], position.top - scrollOffset[1]];
    needsRepositioning = false;
    if (viewportDimensions.width >= this.dimensions.width) {
      if (sticksOut[0]) {
        needsRepositioning = true;
        switch (sticksOut[0]) {
          case this.STICKS_OUT_LEFT:
            tipJoint.setHorizontal("left");
            if (this.options.targetJoint) {
              targetJoint.setHorizontal("right");
            }
            break;
          case this.STICKS_OUT_RIGHT:
            tipJoint.setHorizontal("right");
            if (this.options.targetJoint) {
              targetJoint.setHorizontal("left");
            }
        }
      }
    }
    if (viewportDimensions.height >= this.dimensions.height) {
      if (sticksOut[1]) {
        needsRepositioning = true;
        switch (sticksOut[1]) {
          case this.STICKS_OUT_TOP:
            tipJoint.setVertical("top");
            if (this.options.targetJoint) {
              targetJoint.setVertical("bottom");
            }
            break;
          case this.STICKS_OUT_BOTTOM:
            tipJoint.setVertical("bottom");
            if (this.options.targetJoint) {
              targetJoint.setVertical("top");
            }
        }
      }
    }
    if (!needsRepositioning) {
      return originals;
    }
    if (this.options.stem) {
      stem = tipJoint;
    }
    position = this.getPosition(tipJoint, targetJoint, stem);
    newSticksOut = this._sticksOut(position);
    revertedX = false;
    revertedY = false;
    if (newSticksOut[0] && (newSticksOut[0] !== sticksOut[0])) {
      revertedX = true;
      tipJoint.setHorizontal(this.options.tipJoint.horizontal);
      if (this.options.targetJoint) {
        targetJoint.setHorizontal(this.options.targetJoint.horizontal);
      }
    }
    if (newSticksOut[1] && (newSticksOut[1] !== sticksOut[1])) {
      revertedY = true;
      tipJoint.setVertical(this.options.tipJoint.vertical);
      if (this.options.targetJoint) {
        targetJoint.setVertical(this.options.targetJoint.vertical);
      }
    }
    if (revertedX && revertedY) {
      return originals;
    }
    if (revertedX || revertedY) {
      if (this.options.stem) {
        stem = tipJoint;
      }
      position = this.getPosition(tipJoint, targetJoint, stem);
    }
    return {
      position: position,
      stem: stem
    };
  };

  Opentip.prototype._sticksOut = function(position) {
    var positionOffset, scrollOffset, sticksOut, viewportDimensions;

    scrollOffset = this.adapter.scrollOffset();
    viewportDimensions = this.adapter.viewportDimensions();
    positionOffset = [position.left - scrollOffset[0], position.top - scrollOffset[1]];
    sticksOut = [false, false];
    if (positionOffset[0] < 0) {
      sticksOut[0] = this.STICKS_OUT_LEFT;
    } else if (positionOffset[0] + this.dimensions.width > viewportDimensions.width) {
      sticksOut[0] = this.STICKS_OUT_RIGHT;
    }
    if (positionOffset[1] < 0) {
      sticksOut[1] = this.STICKS_OUT_TOP;
    } else if (positionOffset[1] + this.dimensions.height > viewportDimensions.height) {
      sticksOut[1] = this.STICKS_OUT_BOTTOM;
    }
    return sticksOut;
  };

  Opentip.prototype._draw = function() {
    var backgroundCanvas, bulge, canvasDimensions, canvasPosition, closeButton, closeButtonInner, closeButtonOuter, ctx, drawCorner, drawLine, hb, position, stemBase, stemLength, _i, _len, _ref, _ref1, _ref2,
      _this = this;

    if (!(this.backgroundCanvas && this.redraw)) {
      return;
    }
    this.debug("Drawing background.");
    this.redraw = false;
    if (this.currentStem) {
      _ref = ["top", "right", "bottom", "left"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        position = _ref[_i];
        this.adapter.removeClass(this.container, "stem-" + position);
      }
      this.adapter.addClass(this.container, "stem-" + this.currentStem.horizontal);
      this.adapter.addClass(this.container, "stem-" + this.currentStem.vertical);
    }
    closeButtonInner = [0, 0];
    closeButtonOuter = [0, 0];
    if (__indexOf.call(this.options.hideTriggers, "closeButton") >= 0) {
      closeButton = new Opentip.Joint(((_ref1 = this.currentStem) != null ? _ref1.toString() : void 0) === "top right" ? "top left" : "top right");
      closeButtonInner = [this.options.closeButtonRadius + this.options.closeButtonOffset[0], this.options.closeButtonRadius + this.options.closeButtonOffset[1]];
      closeButtonOuter = [this.options.closeButtonRadius - this.options.closeButtonOffset[0], this.options.closeButtonRadius - this.options.closeButtonOffset[1]];
    }
    canvasDimensions = this.adapter.clone(this.dimensions);
    canvasPosition = [0, 0];
    if (this.options.borderWidth) {
      canvasDimensions.width += this.options.borderWidth * 2;
      canvasDimensions.height += this.options.borderWidth * 2;
      canvasPosition[0] -= this.options.borderWidth;
      canvasPosition[1] -= this.options.borderWidth;
    }
    if (this.options.shadow) {
      canvasDimensions.width += this.options.shadowBlur * 2;
      canvasDimensions.width += Math.max(0, this.options.shadowOffset[0] - this.options.shadowBlur * 2);
      canvasDimensions.height += this.options.shadowBlur * 2;
      canvasDimensions.height += Math.max(0, this.options.shadowOffset[1] - this.options.shadowBlur * 2);
      canvasPosition[0] -= Math.max(0, this.options.shadowBlur - this.options.shadowOffset[0]);
      canvasPosition[1] -= Math.max(0, this.options.shadowBlur - this.options.shadowOffset[1]);
    }
    bulge = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
    if (this.currentStem) {
      if (this.currentStem.left) {
        bulge.left = this.options.stemLength;
      } else if (this.currentStem.right) {
        bulge.right = this.options.stemLength;
      }
      if (this.currentStem.top) {
        bulge.top = this.options.stemLength;
      } else if (this.currentStem.bottom) {
        bulge.bottom = this.options.stemLength;
      }
    }
    if (closeButton) {
      if (closeButton.left) {
        bulge.left = Math.max(bulge.left, closeButtonOuter[0]);
      } else if (closeButton.right) {
        bulge.right = Math.max(bulge.right, closeButtonOuter[0]);
      }
      if (closeButton.top) {
        bulge.top = Math.max(bulge.top, closeButtonOuter[1]);
      } else if (closeButton.bottom) {
        bulge.bottom = Math.max(bulge.bottom, closeButtonOuter[1]);
      }
    }
    canvasDimensions.width += bulge.left + bulge.right;
    canvasDimensions.height += bulge.top + bulge.bottom;
    canvasPosition[0] -= bulge.left;
    canvasPosition[1] -= bulge.top;
    if (this.currentStem && this.options.borderWidth) {
      _ref2 = this._getPathStemMeasures(this.options.stemBase, this.options.stemLength, this.options.borderWidth), stemLength = _ref2.stemLength, stemBase = _ref2.stemBase;
    }
    backgroundCanvas = this.adapter.unwrap(this.backgroundCanvas);
    backgroundCanvas.width = canvasDimensions.width;
    backgroundCanvas.height = canvasDimensions.height;
    this.adapter.css(this.backgroundCanvas, {
      width: "" + backgroundCanvas.width + "px",
      height: "" + backgroundCanvas.height + "px",
      left: "" + canvasPosition[0] + "px",
      top: "" + canvasPosition[1] + "px"
    });
    ctx = backgroundCanvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    ctx.beginPath();
    ctx.fillStyle = this._getColor(ctx, this.dimensions, this.options.background, this.options.backgroundGradientHorizontal);
    ctx.lineJoin = "miter";
    ctx.miterLimit = 500;
    hb = this.options.borderWidth / 2;
    if (this.options.borderWidth) {
      ctx.strokeStyle = this.options.borderColor;
      ctx.lineWidth = this.options.borderWidth;
    } else {
      stemLength = this.options.stemLength;
      stemBase = this.options.stemBase;
    }
    if (stemBase == null) {
      stemBase = 0;
    }
    drawLine = function(length, stem, first) {
      if (first) {
        ctx.moveTo(Math.max(stemBase, _this.options.borderRadius, closeButtonInner[0]) + 1 - hb, -hb);
      }
      if (stem) {
        ctx.lineTo(length / 2 - stemBase / 2, -hb);
        ctx.lineTo(length / 2, -stemLength - hb);
        return ctx.lineTo(length / 2 + stemBase / 2, -hb);
      }
    };
    drawCorner = function(stem, closeButton, i) {
      var angle1, angle2, innerWidth, offset;

      if (stem) {
        ctx.lineTo(-stemBase + hb, 0 - hb);
        ctx.lineTo(stemLength + hb, -stemLength - hb);
        return ctx.lineTo(hb, stemBase - hb);
      } else if (closeButton) {
        offset = _this.options.closeButtonOffset;
        innerWidth = closeButtonInner[0];
        if (i % 2 !== 0) {
          offset = [offset[1], offset[0]];
          innerWidth = closeButtonInner[1];
        }
        angle1 = Math.acos(offset[1] / _this.options.closeButtonRadius);
        angle2 = Math.acos(offset[0] / _this.options.closeButtonRadius);
        ctx.lineTo(-innerWidth + hb, -hb);
        return ctx.arc(hb - offset[0], -hb + offset[1], _this.options.closeButtonRadius, -(Math.PI / 2 + angle1), angle2, false);
      } else {
        ctx.lineTo(-_this.options.borderRadius + hb, -hb);
        return ctx.quadraticCurveTo(hb, -hb, hb, _this.options.borderRadius - hb);
      }
    };
    ctx.translate(-canvasPosition[0], -canvasPosition[1]);
    ctx.save();
    (function() {
      var cornerStem, i, lineLength, lineStem, positionIdx, positionX, positionY, rotation, _j, _ref3, _results;

      _results = [];
      for (i = _j = 0, _ref3 = Opentip.positions.length / 2; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; i = 0 <= _ref3 ? ++_j : --_j) {
        positionIdx = i * 2;
        positionX = i === 0 || i === 3 ? 0 : _this.dimensions.width;
        positionY = i < 2 ? 0 : _this.dimensions.height;
        rotation = (Math.PI / 2) * i;
        lineLength = i % 2 === 0 ? _this.dimensions.width : _this.dimensions.height;
        lineStem = new Opentip.Joint(Opentip.positions[positionIdx]);
        cornerStem = new Opentip.Joint(Opentip.positions[positionIdx + 1]);
        ctx.save();
        ctx.translate(positionX, positionY);
        ctx.rotate(rotation);
        drawLine(lineLength, lineStem.eql(_this.currentStem), i === 0);
        ctx.translate(lineLength, 0);
        drawCorner(cornerStem.eql(_this.currentStem), cornerStem.eql(closeButton), i);
        _results.push(ctx.restore());
      }
      return _results;
    })();
    ctx.closePath();
    ctx.save();
    if (this.options.shadow) {
      ctx.shadowColor = this.options.shadowColor;
      ctx.shadowBlur = this.options.shadowBlur;
      ctx.shadowOffsetX = this.options.shadowOffset[0];
      ctx.shadowOffsetY = this.options.shadowOffset[1];
    }
    ctx.fill();
    ctx.restore();
    if (this.options.borderWidth) {
      ctx.stroke();
    }
    ctx.restore();
    if (closeButton) {
      return (function() {
        var crossCenter, crossHeight, crossWidth, hcs, linkCenter;

        crossWidth = crossHeight = _this.options.closeButtonRadius * 2;
        if (closeButton.toString() === "top right") {
          linkCenter = [_this.dimensions.width - _this.options.closeButtonOffset[0], _this.options.closeButtonOffset[1]];
          crossCenter = [linkCenter[0] + hb, linkCenter[1] - hb];
        } else {
          linkCenter = [_this.options.closeButtonOffset[0], _this.options.closeButtonOffset[1]];
          crossCenter = [linkCenter[0] - hb, linkCenter[1] - hb];
        }
        ctx.translate(crossCenter[0], crossCenter[1]);
        hcs = _this.options.closeButtonCrossSize / 2;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = _this.options.closeButtonCrossColor;
        ctx.lineWidth = _this.options.closeButtonCrossLineWidth;
        ctx.lineCap = "round";
        ctx.moveTo(-hcs, -hcs);
        ctx.lineTo(hcs, hcs);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(hcs, -hcs);
        ctx.lineTo(-hcs, hcs);
        ctx.stroke();
        ctx.restore();
        return _this.adapter.css(_this.closeButtonElement, {
          left: "" + (linkCenter[0] - hcs - _this.options.closeButtonLinkOverscan) + "px",
          top: "" + (linkCenter[1] - hcs - _this.options.closeButtonLinkOverscan) + "px",
          width: "" + (_this.options.closeButtonCrossSize + _this.options.closeButtonLinkOverscan * 2) + "px",
          height: "" + (_this.options.closeButtonCrossSize + _this.options.closeButtonLinkOverscan * 2) + "px"
        });
      })();
    }
  };

  Opentip.prototype._getPathStemMeasures = function(outerStemBase, outerStemLength, borderWidth) {
    var angle, distanceBetweenTips, halfAngle, hb, rhombusSide, stemBase, stemLength;

    hb = borderWidth / 2;
    halfAngle = Math.atan((outerStemBase / 2) / outerStemLength);
    angle = halfAngle * 2;
    rhombusSide = hb / Math.sin(angle);
    distanceBetweenTips = 2 * rhombusSide * Math.cos(halfAngle);
    stemLength = hb + outerStemLength - distanceBetweenTips;
    if (stemLength < 0) {
      throw new Error("Sorry but your stemLength / stemBase ratio is strange.");
    }
    stemBase = (Math.tan(halfAngle) * stemLength) * 2;
    return {
      stemLength: stemLength,
      stemBase: stemBase
    };
  };

  Opentip.prototype._getColor = function(ctx, dimensions, color, horizontal) {
    var colorStop, gradient, i, _i, _len;

    if (horizontal == null) {
      horizontal = false;
    }
    if (typeof color === "string") {
      return color;
    }
    if (horizontal) {
      gradient = ctx.createLinearGradient(0, 0, dimensions.width, 0);
    } else {
      gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
    }
    for (i = _i = 0, _len = color.length; _i < _len; i = ++_i) {
      colorStop = color[i];
      gradient.addColorStop(colorStop[0], colorStop[1]);
    }
    return gradient;
  };

  Opentip.prototype._searchAndActivateCloseButtons = function() {
    var element, _i, _len, _ref;

    _ref = this.adapter.findAll(this.container, "." + this["class"].close);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      this.hideTriggers.push({
        element: this.adapter.wrap(element),
        event: "click"
      });
    }
    if (this.currentObservers.showing) {
      this._setupObservers("-showing", "showing");
    }
    if (this.currentObservers.visible) {
      return this._setupObservers("-visible", "visible");
    }
  };

  Opentip.prototype._activateFirstInput = function() {
    var input;

    input = this.adapter.unwrap(this.adapter.find(this.container, "input, textarea"));
    return input != null ? typeof input.focus === "function" ? input.focus() : void 0 : void 0;
  };

  Opentip.prototype._followMousePosition = function() {
    if (!this.options.fixed) {
      return Opentip._observeMousePosition(this.bound.reposition);
    }
  };

  Opentip.prototype._stopFollowingMousePosition = function() {
    if (!this.options.fixed) {
      return Opentip._stopObservingMousePosition(this.bound.reposition);
    }
  };

  Opentip.prototype._clearShowTimeout = function() {
    return clearTimeout(this._showTimeoutId);
  };

  Opentip.prototype._clearHideTimeout = function() {
    return clearTimeout(this._hideTimeoutId);
  };

  Opentip.prototype._clearTimeouts = function() {
    clearTimeout(this._visibilityStateTimeoutId);
    this._clearShowTimeout();
    return this._clearHideTimeout();
  };

  Opentip.prototype._triggerElementExists = function() {
    var el;

    el = this.adapter.unwrap(this.triggerElement);
    while (el.parentNode) {
      if (el.parentNode.tagName === "BODY") {
        return true;
      }
      el = el.parentNode;
    }
    return false;
  };

  Opentip.prototype._loadAjax = function() {
    var _this = this;

    if (this.loading) {
      return;
    }
    this.loaded = false;
    this.loading = true;
    this.adapter.addClass(this.container, this["class"].loading);
    this.setContent("");
    this.debug("Loading content from " + this.options.ajax);
    return this.adapter.ajax({
      url: this.options.ajax,
      method: this.options.ajaxMethod,
      onSuccess: function(responseText) {
        _this.debug("Loading successful.");
        _this.adapter.removeClass(_this.container, _this["class"].loading);
        return _this.setContent(responseText);
      },
      onError: function(error) {
        var message;

        message = _this.options.ajaxErrorMessage;
        _this.debug(message, error);
        _this.setContent(message);
        return _this.adapter.addClass(_this.container, _this["class"].ajaxError);
      },
      onComplete: function() {
        _this.adapter.removeClass(_this.container, _this["class"].loading);
        _this.loading = false;
        _this.loaded = true;
        _this._searchAndActivateCloseButtons();
        _this._activateFirstInput();
        return _this.reposition();
      }
    });
  };

  Opentip.prototype._ensureTriggerElement = function() {
    if (!this._triggerElementExists()) {
      this.deactivate();
      return this._stopEnsureTriggerElement();
    }
  };

  Opentip.prototype._ensureTriggerElementInterval = 1000;

  Opentip.prototype._startEnsureTriggerElement = function() {
    var _this = this;

    return this._ensureTriggerElementTimeoutId = setInterval((function() {
      return _this._ensureTriggerElement();
    }), this._ensureTriggerElementInterval);
  };

  Opentip.prototype._stopEnsureTriggerElement = function() {
    return clearInterval(this._ensureTriggerElementTimeoutId);
  };

  return Opentip;

})();

vendors = ["khtml", "ms", "o", "moz", "webkit"];

Opentip.prototype.setCss3Style = function(element, styles) {
  var prop, value, vendor, vendorProp, _results;

  element = this.adapter.unwrap(element);
  _results = [];
  for (prop in styles) {
    if (!__hasProp.call(styles, prop)) continue;
    value = styles[prop];
    if (element.style[prop] != null) {
      _results.push(element.style[prop] = value);
    } else {
      _results.push((function() {
        var _i, _len, _results1;

        _results1 = [];
        for (_i = 0, _len = vendors.length; _i < _len; _i++) {
          vendor = vendors[_i];
          vendorProp = "" + (this.ucfirst(vendor)) + (this.ucfirst(prop));
          if (element.style[vendorProp] != null) {
            _results1.push(element.style[vendorProp] = value);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
  }
  return _results;
};

Opentip.prototype.defer = function(func) {
  return setTimeout(func, 0);
};

Opentip.prototype.setTimeout = function(func, seconds) {
  return setTimeout(func, seconds ? seconds * 1000 : 0);
};

Opentip.prototype.ucfirst = function(string) {
  if (string == null) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

Opentip.prototype.dasherize = function(string) {
  return string.replace(/([A-Z])/g, function(_, character) {
    return "-" + (character.toLowerCase());
  });
};

mousePositionObservers = [];

mousePosition = {
  x: 0,
  y: 0
};

mouseMoved = function(e) {
  var observer, _i, _len, _results;

  mousePosition = Opentip.adapter.mousePosition(e);
  _results = [];
  for (_i = 0, _len = mousePositionObservers.length; _i < _len; _i++) {
    observer = mousePositionObservers[_i];
    _results.push(observer());
  }
  return _results;
};

Opentip.followMousePosition = function() {
  return Opentip.adapter.observe(document.body, "mousemove", mouseMoved);
};

Opentip._observeMousePosition = function(observer) {
  return mousePositionObservers.push(observer);
};

Opentip._stopObservingMousePosition = function(removeObserver) {
  var observer;

  return mousePositionObservers = (function() {
    var _i, _len, _results;

    _results = [];
    for (_i = 0, _len = mousePositionObservers.length; _i < _len; _i++) {
      observer = mousePositionObservers[_i];
      if (observer !== removeObserver) {
        _results.push(observer);
      }
    }
    return _results;
  })();
};

Opentip.Joint = (function() {
  function Joint(pointerString) {
    if (pointerString == null) {
      return;
    }
    if (pointerString instanceof Opentip.Joint) {
      pointerString = pointerString.toString();
    }
    this.set(pointerString);
    this;
  }

  Joint.prototype.set = function(string) {
    string = string.toLowerCase();
    this.setHorizontal(string);
    this.setVertical(string);
    return this;
  };

  Joint.prototype.setHorizontal = function(string) {
    var i, valid, _i, _j, _len, _len1, _results;

    valid = ["left", "center", "right"];
    for (_i = 0, _len = valid.length; _i < _len; _i++) {
      i = valid[_i];
      if (~string.indexOf(i)) {
        this.horizontal = i.toLowerCase();
      }
    }
    if (this.horizontal == null) {
      this.horizontal = "center";
    }
    _results = [];
    for (_j = 0, _len1 = valid.length; _j < _len1; _j++) {
      i = valid[_j];
      _results.push(this[i] = this.horizontal === i ? i : void 0);
    }
    return _results;
  };

  Joint.prototype.setVertical = function(string) {
    var i, valid, _i, _j, _len, _len1, _results;

    valid = ["top", "middle", "bottom"];
    for (_i = 0, _len = valid.length; _i < _len; _i++) {
      i = valid[_i];
      if (~string.indexOf(i)) {
        this.vertical = i.toLowerCase();
      }
    }
    if (this.vertical == null) {
      this.vertical = "middle";
    }
    _results = [];
    for (_j = 0, _len1 = valid.length; _j < _len1; _j++) {
      i = valid[_j];
      _results.push(this[i] = this.vertical === i ? i : void 0);
    }
    return _results;
  };

  Joint.prototype.eql = function(pointer) {
    return (pointer != null) && this.horizontal === pointer.horizontal && this.vertical === pointer.vertical;
  };

  Joint.prototype.flip = function() {
    var flippedIndex, positionIdx;

    positionIdx = Opentip.position[this.toString(true)];
    flippedIndex = (positionIdx + 4) % 8;
    this.set(Opentip.positions[flippedIndex]);
    return this;
  };

  Joint.prototype.toString = function(camelized) {
    var horizontal, vertical;

    if (camelized == null) {
      camelized = false;
    }
    vertical = this.vertical === "middle" ? "" : this.vertical;
    horizontal = this.horizontal === "center" ? "" : this.horizontal;
    if (vertical && horizontal) {
      if (camelized) {
        horizontal = Opentip.prototype.ucfirst(horizontal);
      } else {
        horizontal = " " + horizontal;
      }
    }
    return "" + vertical + horizontal;
  };

  return Joint;

})();

Opentip.prototype._positionsEqual = function(posA, posB) {
  return (posA != null) && (posB != null) && posA.left === posB.left && posA.top === posB.top;
};

Opentip.prototype._dimensionsEqual = function(dimA, dimB) {
  return (dimA != null) && (dimB != null) && dimA.width === dimB.width && dimA.height === dimB.height;
};

Opentip.prototype.debug = function() {
  var args;

  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (Opentip.debug && ((typeof console !== "undefined" && console !== null ? console.debug : void 0) != null)) {
    args.unshift("#" + this.id + " |");
    return console.debug.apply(console, args);
  }
};

Opentip.findElements = function() {
  var adapter, content, element, optionName, optionValue, options, _i, _len, _ref, _results;

  adapter = Opentip.adapter;
  _ref = adapter.findAll(document.body, "[data-ot]");
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    element = _ref[_i];
    options = {};
    content = adapter.data(element, "ot");
    if (content === "" || content === "true" || content === "yes") {
      content = adapter.attr(element, "title");
      adapter.attr(element, "title", "");
    }
    content = content || "";
    for (optionName in Opentip.styles.standard) {
      optionValue = adapter.data(element, "ot" + (Opentip.prototype.ucfirst(optionName)));
      if (optionValue != null) {
        if (optionValue === "yes" || optionValue === "true" || optionValue === "on") {
          optionValue = true;
        } else if (optionValue === "no" || optionValue === "false" || optionValue === "off") {
          optionValue = false;
        }
        options[optionName] = optionValue;
      }
    }
    _results.push(new Opentip(element, content, options));
  }
  return _results;
};

Opentip.version = "2.4.6";

Opentip.debug = false;

Opentip.lastId = 0;

Opentip.lastZIndex = 100;

Opentip.tips = [];

Opentip._abortShowingGroup = function(group, originatingOpentip) {
  var opentip, _i, _len, _ref, _results;

  _ref = Opentip.tips;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    opentip = _ref[_i];
    if (opentip !== originatingOpentip && opentip.options.group === group) {
      _results.push(opentip._abortShowing());
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

Opentip._hideGroup = function(group, originatingOpentip) {
  var opentip, _i, _len, _ref, _results;

  _ref = Opentip.tips;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    opentip = _ref[_i];
    if (opentip !== originatingOpentip && opentip.options.group === group) {
      _results.push(opentip.hide());
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

Opentip.adapters = {};

Opentip.adapter = null;

firstAdapter = true;

Opentip.addAdapter = function(adapter) {
  Opentip.adapters[adapter.name] = adapter;
  if (firstAdapter) {
    Opentip.adapter = adapter;
    adapter.domReady(Opentip.findElements);
    adapter.domReady(Opentip.followMousePosition);
    return firstAdapter = false;
  }
};

Opentip.positions = ["top", "topRight", "right", "bottomRight", "bottom", "bottomLeft", "left", "topLeft"];

Opentip.position = {};

_ref = Opentip.positions;
for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
  position = _ref[i];
  Opentip.position[position] = i;
}

Opentip.styles = {
  standard: {
    "extends": null,
    title: void 0,
    escapeTitle: true,
    escapeContent: false,
    className: "standard",
    stem: true,
    delay: null,
    hideDelay: 0.1,
    fixed: false,
    showOn: "mouseover",
    hideTrigger: "trigger",
    hideTriggers: [],
    hideOn: null,
    removeElementsOnHide: false,
    offset: [0, 0],
    containInViewport: true,
    autoOffset: true,
    showEffect: "appear",
    hideEffect: "fade",
    showEffectDuration: 0.3,
    hideEffectDuration: 0.2,
    stemLength: 5,
    stemBase: 8,
    tipJoint: "top left",
    target: null,
    targetJoint: null,
    cache: true,
    ajax: false,
    ajaxMethod: "GET",
    ajaxErrorMessage: "There was a problem downloading the content.",
    group: null,
    style: null,
    background: "#fff18f",
    backgroundGradientHorizontal: false,
    closeButtonOffset: [5, 5],
    closeButtonRadius: 7,
    closeButtonCrossSize: 4,
    closeButtonCrossColor: "#d2c35b",
    closeButtonCrossLineWidth: 1.5,
    closeButtonLinkOverscan: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#f2e37b",
    shadow: true,
    shadowBlur: 10,
    shadowOffset: [3, 3],
    shadowColor: "rgba(0, 0, 0, 0.1)"
  },
  glass: {
    "extends": "standard",
    className: "glass",
    background: [[0, "rgba(252, 252, 252, 0.8)"], [0.5, "rgba(255, 255, 255, 0.8)"], [0.5, "rgba(250, 250, 250, 0.9)"], [1, "rgba(245, 245, 245, 0.9)"]],
    borderColor: "#eee",
    closeButtonCrossColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 15,
    closeButtonRadius: 10,
    closeButtonOffset: [8, 8]
  },
  dark: {
    "extends": "standard",
    className: "dark",
    borderRadius: 13,
    borderColor: "#444",
    closeButtonCrossColor: "rgba(240, 240, 240, 1)",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: [2, 2],
    background: [[0, "rgba(30, 30, 30, 0.7)"], [0.5, "rgba(30, 30, 30, 0.8)"], [0.5, "rgba(10, 10, 10, 0.8)"], [1, "rgba(10, 10, 10, 0.9)"]]
  },
  alert: {
    "extends": "standard",
    className: "alert",
    borderRadius: 1,
    borderColor: "#AE0D11",
    closeButtonCrossColor: "rgba(255, 255, 255, 1)",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: [2, 2],
    background: [[0, "rgba(203, 15, 19, 0.7)"], [0.5, "rgba(203, 15, 19, 0.8)"], [0.5, "rgba(189, 14, 18, 0.8)"], [1, "rgba(179, 14, 17, 0.9)"]]
  }
};

Opentip.defaultStyle = "standard";

if (typeof module !== "undefined" && module !== null) {
  module.exports = Opentip;
} else {
  window.Opentip = Opentip;
}

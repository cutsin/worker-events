'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// Proxy Events (singleton)
var eventId = 1;

var WorkerEvents = function WorkerEvents() {
  var _this = this;

  _classCallCheck(this, WorkerEvents);

  this.inWindow = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object';
  this.listeners = {}
  /* ...Map() */
  // emit
  ;

  this.emit = function (eventname, data) {
    eventId++;
    var msg = {
      data: data,
      eventId: eventId // Always trigger event to self-env asynchronous

    };
    setTimeout(function () {
      var listener = _this.listeners[eventname];

      if (listener) {
        listener.forEach(function (opts, cb) {
          cb(msg);
          if (opts && opts.once) _this.off(eventname, cb);
        });
      }
    }); // In worker, also post to window

    if (!_this.inWindow) {
      postMessage(Object.assign(msg, {
        eventname: eventname,
        cmd: 'worker-events'
      }));
    }
  }; //


  this.off = function (eventname, cb) {
    var listener = _this.listeners[eventname];
    if (listener && listener.has(cb)) listener.delete(cb);
  }; // on


  this.on = function (eventname, cb, opts) {
    var listener = _this.listeners[eventname];

    if (listener) {
      listener.set(cb, opts);
    } else {
      _this.listeners[eventname] = new Map([[cb, opts]]);
    }
  };

  this.once = function (eventname, cb) {
    _this.on(eventname, cb, {
      once: true
    });
  };
};

var workerEvents = new WorkerEvents();

module.exports = workerEvents;

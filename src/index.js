// Proxy Events (singleton)
let eventId = 1

class WorkerEvents {
  constructor () {
    this.inWindow = typeof window === 'object'
    this.listeners = {/* ...Map() */}
    // emit
    this.emit = (eventname, data) => {
      eventId++
      const msg = {data, eventId}
      // Always trigger event to self-env asynchronous
      setTimeout(() => {
        const listener = this.listeners[eventname]
        if (listener) {
          listener.forEach((opts, cb) => {
            cb(msg)
            if (opts && opts.once) this.off(eventname, cb)
          })
        }
      })
      // In worker, also post to window
      if (!this.inWindow) {
        postMessage(Object.assign(msg, {eventname, cmd: 'worker-events'}))
      }
    }
    //
    this.off = (eventname, cb) => {
      const listener = this.listeners[eventname]
      if (listener && listener.has(cb)) listener.delete(cb)
    }
    // on
    this.on = (eventname, cb, opts) => {
      const listener = this.listeners[eventname]
      if (listener) {
        listener.set(cb, opts)
      } else {
        this.listeners[eventname] = new Map([[cb, opts]])
      }
    }
    this.once = (eventname, cb) => {
      this.on(eventname, cb, {once: true})
    }
  }
}

const workerEvents = new WorkerEvents()

export default workerEvents

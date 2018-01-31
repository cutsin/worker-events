# Proxy Events in browser or worker

## Usage

### In worker

```javascript
import workerEvents from 'worker-events'
workerEvents.emit('bar', 2)
workerEvents.emit('sth', 3)
workerEvents.on('sth', res => console.log(res))
// >> 3
```

### In browser

```javascript
import workerEvents from 'worker-events'
workerEvents.on('foo', res => console.log(res))
workerEvents.on('bar', res => console.log(res))
workerEvents.emit('foo', 1)
// >> 1
// >> 2
```
# Proxy Events in browser or worker

## Usage

### In browser

```javascript
import workerEvents from 'worker-events'
workerEvents.emit('foo', 1)
workerEvents.on('foo', res => console.log(res))
```

### In worker

```javascript
import workerEvents from 'worker-events'

```
const io = require('socket.io-client')
const client = io('walkertrekker.herokuapp.com')

function test() {
  client.connect()
  client.on('connect', () => console.log('connected'))
  client.emit('log', 'log this, babyyyyyy')
  client.disconnect()
  process.exit(0)
}

test()

const io = require('socket.io-emitter')({ host: '10.1.10.217', port: 5000 })

function test() {
  io.emit('log', 'hey there good lookin we\'ll be back to pick you up later')
  process.exit(0)
}

test()

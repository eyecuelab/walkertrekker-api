require('dotenv').config()

var express = require('express')
var path = require('path')
// var passport = require('passport')
var flash = require('connect-flash')

// var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var http = require('http');

var app = express()
var port = process.env.PORT || 5000
var server = http.Server(app)
var io = require('socket.io')(server, {
  pingTimeout: 30000,
  pingInterval: 30000
})

const { registerEventListenersOnConnect } = require('./app/socket')

io.on('connection', (socket) => {
  registerEventListenersOnConnect(socket)
  
});

app.use(function(req, res, done){
  res.io = io
  done()
})
app.use(express.static(path.join(__dirname, 'public')))
// app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({ secret: 'hfT5g64hf7Vw4D2gdh9Y&4!jf8',
                  cookie: { maxAge: 60000 },
                  resave: true,
                  saveUninitialized: true }))

app.get('/', function (req, res) {
  if (req.headers['appkey'] !== process.env.CLIENT_APP_KEY) {
    res.render('index')
  }
})

// app.use(passport.initialize())
// app.use(passport.session())
app.use(flash())

require('./app/routes')(app)
app.set('port', port);

/**
 * Create HTTP server.
 */

// app.listen(port)
// console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode. On port ' + port)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log(`Listening on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);

var debug = require('debug')('myapp:server');

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// const cloudinary = require('cloudinary')
// async function upload() {
//   const basketball = await cloudinary.uploader.upload('basketball.jpg', { tags: 'a_basketball' })
//   console.log(basketball)
// }
// upload()
// cloudinary.uploader.upload('basketball.jpg', { tags: 'a_basketball' })
// .then(function(img){
//   console.log();
//   console.log("** File Upload (Promise)");
//   console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
//   console.log("* "+img.public_id);
//   console.log("* "+img.url);
// })
// .catch(function(err){
//   console.log();
//   console.log("** File Upload (Promise)");
//   if (err){ console.warn(err);}
// });

module.exports = io

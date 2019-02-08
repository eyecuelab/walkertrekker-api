const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { fetchAllPlayers } = require('../middlewares');
const Player = sequelize.import('../models/player');
Player.sync();

function playersRouter (app) {
  app.get('/api/allPlayers', fetchAllPlayers, function(req, res) {
    co(function * () {
      let arr = []
      for (let player of req.players) {
        let json = yield player.toJson();
        arr.push(json);
      }
      return res.json(arr)
    }).catch(function(err) {
      console.log(err)
      res.json({ error: 'Error fetching players' })
    })
  })

}

module.exports = playersRouter

// function loginRequired (req, res, done) {
//   User.findOne({ where: { authToken: req.headers['auth_token'] } }).then(function (user) {
//     if (!user) return res.status(401).json({ error: 'Get lost!!' })
//
//     req.user = user
//     done()
//   })
// }
//
// function fetchGame (req, res, done) {
//   Game.findOne({ where: { accessToken: req.params.accessToken } }).then(function (game) {
//     if (!game) return res.status(401).json({ error: 'Unauthorized' })
//
//     req.game = game
//     done()
//   })
// }
//
// app.get('/api/games/:accessToken', loginRequired, fetchGame, function (req, res) {
//     co(function * () {
//       let json = yield req.game.toJson()
//       return res.json(json)
//     }).catch(function (err) {
//       console.log(err)
//       res.json({ error: 'Error fetching a game' })
//     })
//   }
// )

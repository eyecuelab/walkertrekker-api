const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { loginRequired, fetchOpenGame, fetchGame } = require('../middlewares')
const Game = sequelize.import('../models/game')

function gamesRouter (app) {
  /**
   * @api {post} /api/games Join
   * @apiName PostGame
   * @apiGroup Games
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" -d '{"boards": [], "manaItems": [], "gameItems": []}' http://localhost:5000/api/games
   *
   * @apiSuccess {String} id Game uid
   * @apiSuccess {String} accessToken Access Token
   * @apiSuccess {Object} player1 Game initiator profile information
   * @apiSuccess {Integer} player1.id Id
   * @apiSuccess {String} player1.username First name
   * @apiSuccess {String} player1.imageUrl Image url
   * @apiSuccess {Object} player2 Opponent profile information
   * @apiSuccess {Integer} player2.id Id
   * @apiSuccess {String} player2.username First name
   * @apiSuccess {String} player2.imageUrl Image url
   * @apiSuccess {Array} boards Boards list
   * @apiSuccess {Array} manaItems Mana items list
   * @apiSuccess {Array} goldItems Gold items list
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "id": 123,
   *     "accessToken": 123,
   *     "player1": {},
   *     "player2": {},
   *     "boards": [],
   *     "manaItems": [],
   *     "goldItems": []
   *   }
   */
  app.post('/api/games', loginRequired, fetchOpenGame, function (req, res) {
    co(function * () {
      if (!req.game) {
        req.game = yield initGame(req.user, req.body)
      } else if (req.game.userId != req.user.id) {
          req.game.opponentId = req.user.id
          yield req.game.save()
      }

      let json = yield req.game.toJson()
      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error joining a game' })
    })
  })

  /**
   * @api {get} /api/games/:accessToken Get
   * @apiName GetGame
   * @apiGroup Games
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" http://localhost:5000/api/games/1111-1111-1111-1111
   *
   * @apiSuccess {String} id Game uid
   * @apiSuccess {String} accessToken Access Token
   * @apiSuccess {Object} player1 Game initiator profile information
   * @apiSuccess {Integer} player1.id Id
   * @apiSuccess {String} player1.username First name
   * @apiSuccess {String} player1.imageUrl Image url
   * @apiSuccess {Object} player2 Opponent profile information
   * @apiSuccess {Integer} player2.id Id
   * @apiSuccess {String} player2.username First name
   * @apiSuccess {String} player2.imageUrl Image url
   * @apiSuccess {Array} boards Boards list
   * @apiSuccess {Array} manaItems Mana items list
   * @apiSuccess {Array} goldItems Gold items list
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "id": 123,
   *     "accessToken": 123,
   *     "player1": {},
   *     "player2": {},
   *     "boards": [],
   *     "manaItems": [],
   *     "goldItems": []
   *   }
   */
  app.get('/api/games/:accessToken', loginRequired, fetchGame, function (req, res) {
      co(function * () {
        let json = yield req.game.toJson()
        return res.json(json)
      }).catch(function (err) {
        console.log(err)
        res.json({ error: 'Error fetching a game' })
      })
    }
  )

  /**
   * @api {post} /api/games/:accessToken/events Post game event
   * @apiName PostEvent
   * @apiGroup Games
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" -d '{"key": "value"}' http://localhost:5000/api/games/1111-1111-1111-1111/events
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {}
   */
  app.post('/api/games/:accessToken/events',
    loginRequired,
    fetchGame,
    function (req, res) {
      res.io.in(req.game.accessToken).emit('gameEvent', req.body)
      res.json({})
    }
  )

  /**
   * @api {delete} /api/games/:accessToken Delete
   * @apiName DeleteGame
   * @apiGroup Games
   *
   * @apiExample {curl} Example usage:
   *   curl -X DELETE -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" http://localhost:5000/api/games/1111-1111-1111-1111
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {}
   */
  app.delete('/api/games/:accessToken',
    loginRequired,
    fetchGame,
    function (req, res) {
      req.game.destroy().then(function () {
        return res.json({})
      }).catch(function (err) {
        console.log(err)
        return res.json({ error: 'Error deleting a game' })
      })
    }
  )
}

function * initGame (user, data) {
  let opts = {
    userId: user.id,
    accessToken: uuid.v1(),
    data: {}
  }
  let inputs = ['boards', 'manaItems', 'goldItems']
  for (let input of inputs) {
    if (data[input]) opts.data[input] = data[input]
  }
  let game = Game.build(opts)

  return yield game.save()
}

module.exports = gamesRouter

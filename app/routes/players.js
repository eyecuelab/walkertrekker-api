const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { fetchAllPlayers, fetchPlayer } = require('../middlewares');
const Player = sequelize.import('../models/player');
Player.sync();

function playersRouter (app) {

  /**
   * @api {get} /api/players Fetch All Players
   * @apiName GetAllPlayers
   * @apiGroup Players
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" http://localhost:5000/api/players
   *
   * @apiSuccess {String} id Player UUID
   * @apiSuccess {String} displayName Player Name
   * @apiSuccess {String} phoneNumber Phone Number
   * @apiSuccess {Boolean} inActiveGame True if player is in a game
   * @apiSuccess {String} campaignId UUID of current game (if inActiveGame is true, else null)
   * @apiSuccess {Integer} health Current player health
   * @apiSuccess {Integer} hunger Current player hunger
   * @apiSuccess {Integer[]} steps Number of steps per campaign day
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   * [
   *  {
   *     "id": "58568813-712d-451b-9125-4103c6f1d7e5",
   *     "displayName": "Wilt Chamberlain",
   *     "phoneNumber": "5035551582",
   *     "inActiveGame": false,
   *     "campaignId": null,
   *     "health": null,
   *     "hunger": null,
   *      "steps": null
   *    }
   * ]
  */
  app.get('/api/players', fetchAllPlayers, function(req, res) {
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

  /**
   * @api {post} /api/players Create New Player
   * @apiName Create New Player
   * @apiGroup Players
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" -d '{"displayName": "Oscar Robertson", "phoneNumber": * "5035558989"}' http://localhost:5000/api/players
   *
   * @apiSuccess {String} id Player UUID
   * @apiSuccess {String} displayName Player Name
   * @apiSuccess {String} phoneNumber Phone Number
   * @apiSuccess {Boolean} inActiveGame True if player is in a game
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
       "id": "a2e8a0da-9b6a-4ead-b783-f57af591cf4a",
       "displayName": "Oscar Robertson",
       "phoneNumber": "5035558989",
       "inActiveGame": false
   }
  */
  app.post('/api/players', fetchPlayer, function(req, res) {
    co(function * () {
      if (req.player) {
        return res.json({ error: `Player already exists, cannot create this player.`})
      } else {
        const newPlayer = Player.build({
          id: uuid.v4(),
          displayName: req.body.displayName,
          phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : null,
          inActiveGame: false,
        })
        newPlayer.save()
        let json = yield newPlayer.toJson();
        return res.json(json)
      }
    }).catch(function(error) {
      console.log(error)
      return res.json({ error: 'Error creating new player' })
    })
  })
}

module.exports = playersRouter

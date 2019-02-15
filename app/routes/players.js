const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchAllPlayers, fetchPlayer, lookupPhone } = require('../middlewares');
const Player = sequelize.import('../models/player');
const Campaign = sequelize.import('../models/campaign');

function playersRouter (app) {

  /**
   * @api {get} /api/players Fetch All Players
   * @apiName Get All Players
   * @apiGroup Players
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/players
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
   *     "phoneNumber": "+15035551582",
   *     "inActiveGame": false,
   *     "campaignId": null,
   *     "health": null,
   *     "hunger": null,
   *      "steps": null
   *    }
   * ]
  */
  app.get('/api/players', appKeyCheck, fetchAllPlayers, function(req, res) {
    co(function * () {
      let arr = []
      for (let player of req.players) {
        let json = player.toJson();
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
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -H -d '{"displayName": "Oscar Robertson", "phoneNumber": "5035558989"}' http://walkertrekker.herokuapp.com/api/players
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
       "phoneNumber": "+15035558989",
       "inActiveGame": false
   }
  */
  app.post('/api/players', appKeyCheck, fetchPlayer, lookupPhone, function(req, res) {
    co(function * () {
      if (req.player !== 'No player found') {
        return res.json({ error: `Player already exists, cannot create this player.`})
      } else if (res.error) {
        return res.json(res.error)
      } else {
        const newPlayer = Player.build({
          id: uuid.v4(),
          displayName: req.body.displayName,
          phoneNumber: req.phoneNumber,
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

  /**
   * @api {patch} /api/players Update Player
   * @apiName Update Player
   * @apiGroup Players
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -H -d '{ "playerId": "58568813-712d-451b-9125-4103c6f1d7e5", "playerUpdate": { "hunger" 88, "steps": [1698, 0, 0, 0, ...] } }' http://walkertrekker.herokuapp.com/api/players
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
   *     "phoneNumber": "+15035551582",
   *     "inActiveGame": true,
   *     "campaignId": "58568813-712d-451b-9125-4103c6f1d7e5",
   *     "health": 100,
   *     "hunger": 88,
   *      "steps": [1689, 0, 0, ...]
   *    }
   * ]
  */
  app.patch('/api/players', appKeyCheck, fetchPlayer, function(req, res) {
    co(function* () {
      let player = req.player
      player.update(req.body.playerUpdate)
      let json = player.toJson()
      return res.json(json)
    }).catch(function(err) {
      console.log(err)
      return res.json({ error: 'Error updating player info' })
    })
  })

}

module.exports = playersRouter

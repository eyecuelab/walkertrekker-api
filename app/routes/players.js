const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { fetchAllPlayers } = require('../middlewares');
const Player = sequelize.import('../models/player');
Player.sync();

function playersRouter (app) {

  /**
   * @api {get} /api/players Get
   * @apiName GetAllPlayers
   * @apiGroup Players
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" http://localhost:5000/api/players/allPlayers
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

}

module.exports = playersRouter

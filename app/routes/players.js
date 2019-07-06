const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const cloudinary = require('cloudinary')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { appKeyCheck, playerLookup, fetchPlayer, checkDuplicateNum, lookupPhone, getImage } = require('../middlewares');
const Player = sequelize.import('../models/player');
const Campaign = sequelize.import('../models/campaign');

function playersRouter (app) {

  /**
   * @api {get} /api/players/:playerId Fetch Player
   * @apiName Fetch Player
   * @apiGroup Players
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/players/:playerId
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
  */
  app.get('/api/players/:playerId', appKeyCheck, fetchPlayer, function(req, res) {
    co(async function () {
      console.log("env", process.env.DATABASE_URL)
      let player = await Player.findOne({
        where: { id: req.params.playerId }
      })
      if (player == null) {
        return res.json({ error: 'No player found with specified player ID' })
      }
      let json = await player.toJson()
      return res.json(json)
    }).catch(function(err) {
      console.log(err)
      res.json({ error: 'Error fetching players' })
    })
  })


  // endpoint for account recovery
  app.get('/api/players/recover/:phoneNumber', appKeyCheck, function(req, res) {
    co(async function () {
      let player = await Player.findOne({
        where: { phoneNumber: req.params.phoneNumber }
      })
      if (player == null) {
        return res.json({ error: 'No player found with specified player number, cannot send recovery message' })
      }
      const link = req.body.link ? req.body.link : `walkertreker://recovery?playerId=${player.id}`
      player.getAccount(player.phoneNumber, link)
      let json = await player.toJson()
      return res.json(json)
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
   *   curl -X POST -H "Content-Type: multipart/form-data" -H "appkey: abc" -F displayName="Oscar Robertson" -F phoneNumber="5035558989" -F avatar=yourFileHere http://walkertrekker.herokuapp.com/api/players
   *
   * @apiSuccess {String} id Player UUID
   * @apiSuccess {String} displayName Player Name
   * @apiSuccess {String} phoneNumber Phone Number (normalized format)
   * @apiSuccess {Boolean} inActiveGame
   * @apiSuccess {String[]} invited
   * @apiSuccess {String} avatar Cloudinary public_id for uploaded avatar
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
       "id": "a2e8a0da-9b6a-4ead-b783-f57af591cf4a",
       "displayName": "Oscar Robertson",
       "phoneNumber": "+15035558989",
       "inActiveGame": false,
       "invited": [],
       "avatar": "fdcpcusi5f5ef2bwg52x"
   }
  */
  app.post('/api/players', upload.single('avatar'), appKeyCheck, fetchPlayer, checkDuplicateNum,lookupPhone, async function(req, res) {
    try {
      if (req.player !== 'No player found' || req.number !== 'No number found') {
        console.log('player found')
        return res.json({ error: `Player already exists, cannot create this player.`})
      } else if (res.error) {
        return res.json(res.error)
      }
      let playerAvatar = null;
      if (req.file) {
        avatarUpload = await cloudinary.uploader.upload(req.file.path)
        playerAvatar = avatarUpload.public_id
      }
      console.log('now building player')
      const newPlayer = Player.build({
        id: uuid.v4(),
        displayName: req.body.displayName,
        phoneNumber: req.phoneNumber,
        inActiveGame: false,
        avatar: playerAvatar,
        pushToken: req.body.pushToken,
      })
      newPlayer.save()
      let json = newPlayer.toJson();
      return res.json(json)
    } catch (error) {
      return res.json({ error: 'Error creating new player' })
    }
  })

  /**
   * @api {post} /api/players/avatar Update Player
   * @apiName Post an avatar
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
    co(async function () {
      let player = req.player
      await player.update(req.body.playerUpdate)
      if (player.campaignId) {
        const campaign = await Campaign.findOne({ where: { id: player.campaignId } })
        const info = await campaign.toJson()
        res.io.in(campaign.id).emit('sendCampaignInfo', info)
      }
      let json = player.toJson()
      res.io.in(player.id).emit('sendPlayerInfo', json)
      return res.json(json)
    }).catch(function(err) {
      console.log(err)
      return res.json({ error: 'Error updating player info' })
    })
  })


  app.post('/api/players/avatar', appKeyCheck, upload.single('avatar'), async function(req, res) {
    try {
      let player = await Player.findOne({ where: { id: req.body.playerId }})
      let playerAvatar = await cloudinary.uploader.upload(req.file.path)
      player.avatar = playerAvatar.public_id
      player.save()
      const json = player.toJson()
      return res.json(json)
    }
    catch (err) {
      console.log(err)
      return res.json({ error: 'Error uploading image' })
    }
  })
}

module.exports = playersRouter

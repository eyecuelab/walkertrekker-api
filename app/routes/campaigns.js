const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchCampaign, fetchPlayer, lookupPhone, checkPlayerInActiveCampaign, } = require('../middlewares');
const Campaign = sequelize.import('../models/campaign');
const Player = sequelize.import('../models/player');

function campaignsRouter (app) {

  /**
   * @api {get} /api/campaigns/:campaignId Fetch Campaign
   * @apiName Fetch Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" https://walkertrekker.herokuapp.com/api/campaigns/58568813-712d-451b-9125-4103c6f1d7e5
   *
   * @apiSuccess {String} id Campaign UUID
   * @apiSuccess {Date} startDate First day of campaign (not necessarily createdAt date)
   * @apiSuccess {Date} endDate Last day of campaign
   * @apiSuccess {Integer} currentDay Current step of campaign (default: 0)
   * @apiSuccess {String} length '15', '30', '90'
   * @apiSuccess {String} difficultyLevel 'easy', 'hard', 'xtreme'
   * @apiSuccess {String} randomEvents 'low', 'mid', 'high'
   * @apiSuccess {Integer} numPlayers
   * @apiSuccess {Integer[]} stepTargets array of steps each player needs to complete per day
   * @apiSuccess {Object} inventory
   * @apiSuccess {Integer} inventory.foodItems
   * @apiSuccess {Integer} inventory.medicineItems
   * @apiSuccess {Integer} inventory.weaponItems
   * @apiSuccess {Player[]} players array of player instances associated with this game (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
       "id": "9801ce7c-ad31-4c7e-ab91-fe53e65642c5",
       "startDate": "2019-02-08",
       "endDate": "2019-03-10",
       "currentDay": 0,
       "length": "30",
       "difficultyLevel": "hard",
       "randomEvents": "low",
       "numPlayers": 0,
       "stepTargets": [
           6000,
           0, ...
       ],
       "inventory": {
           "foodItems": 0,
           "weaponItems": 0,
           "medicineItems": 0
       },
       "players": []
   }
  */
  app.get('/api/campaigns/:campaignId', appKeyCheck, fetchCampaign, function(req, res) {
    co(function * () {
      if (req.campaign == null) {
        return res.json({ error: 'No campaign found with specified campaignId'})
      }
      let json = yield req.campaign.toJson();
      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error fetching a campaign' })
    })
  })

  /**
   * @api {post} /api/campaigns/ Create New Campaign
   * @apiName Create New Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -d '{ "params": { "campaignLength": "30", "difficultyLevel": "hard", "randomEvents": "low" } }' https://walkertrekker.herokuapp.com/api/campaigns
   *
   * @apiSuccess {String} id Campaign UUID
   * @apiSuccess {Date} startDate First day of campaign (not necessarily createdAt date)
   * @apiSuccess {Date} endDate Last day of campaign
   * @apiSuccess {Integer} currentDay Current step of campaign (default: 0)
   * @apiSuccess {String} length '15', '30', '90'
   * @apiSuccess {String} difficultyLevel 'easy', 'hard', 'xtreme'
   * @apiSuccess {String} randomEvents 'low', 'mid', 'high'
   * @apiSuccess {Integer} numPlayers
   * @apiSuccess {Integer[]} stepTargets array of steps each player needs to complete per day
   * @apiSuccess {Object} inventory
   * @apiSuccess {Integer} inventory.foodItems
   * @apiSuccess {Integer} inventory.medicineItems
   * @apiSuccess {Integer} inventory.weaponItems
   * @apiSuccess {Player[]} players array of player instances associated with this game (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
       "id": "9801ce7c-ad31-4c7e-ab91-fe53e65642c5",
       "startDate": "2019-02-08",
       "endDate": "2019-03-10",
       "currentDay": 0,
       "length": "30",
       "difficultyLevel": "hard",
       "randomEvents": "low",
       "numPlayers": 0,
       "stepTargets": [
           6000,
           0, ...
       ],
       "inventory": {
           "foodItems": 0,
           "weaponItems": 0,
           "medicineItems": 0
       },
       "players": []
   }
  */
  app.post('/api/campaigns/', appKeyCheck, fetchPlayer, function(req, res) {
    co(async function () {
      if (req.player == 'No player found') {
        return res.json({ error: 'No player found with given playerId, cannot create campaign.' })
      }
      let player = req.player
      let stepTargets = [];
      const params = req.body.params;
      const len = parseInt(params.campaignLength);
      for (let i = 0; i < len; i++) {stepTargets[i] = 0}
      if (params.difficultyLevel == 'easy') {stepTargets[0] = 2000} // assuming 1 mile - 2000 steps
      else if (params.difficultyLevel == 'hard') {stepTargets[0] = 6000}
      else {stepTargets[0] = 10000}
      const newCampaign = await Campaign.create({
        id: uuid.v4(),
        currentDay: 0,
        length: params.campaignLength,
        difficultyLevel: params.difficultyLevel,
        randomEvents: params.randomEvents,
        numPlayers: 1,
        stepTargets,
        inventory: { foodItems: 0, medicineItems: 0, weaponItems: 0 },
        host: player.id,
      })
      await newCampaign.addPlayer(player.id)
      await player.update(player.initCampaign(len))
      let json = await newCampaign.toJson()
      res.io.in(player.id).emit('sendPlayerInfo', json)
      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error creating a game' })
    })
  })

//   app.patch('/api/campaigns/join/:campaignId', appKeyCheck, fetchCampaign, fetchPlayer, function (req, res) {
//   co(async function() {
//     let campaign = req.campaign
//     let player = req.player
//     if (campaign.numPlayers == 5) {
//       return res.json({ error: `Sorry, this campaign is full.`})
//     }
//     campaign.addPlayer(player)
//     campaign.numPlayers++
//     player.inActiveGame = true
//     player.hunger = 100
//     player.health = 100
//     let steps = []
//     for (let i=0; i < parseInt(campaign.length); i++) {
//       steps.push(0)
//     }
//     player.steps = steps
//     await player.save()
//     await campaign.save()
//     let json = await campaign.toJson()
//     res.io.in(campaign.id).emit('sendCampaignInfo', json)
//     return res.json(json)
//   }).catch(function (err) {
//     console.log(err)
//     res.json({ error: 'Error joining game' })
//   })
// })

  /**
   * @api {patch} /api/campaigns/join/:campaignId Join Campaign
   * @apiName Join Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -d '{ "playerId": "7dd089c0-7f4b-4f39-a662-53554834a8f7" }' https://walkertrekker.herokuapp.com/api/campaigns/join/58568813-712d-451b-9125-4103c6f1d7e5
   *
   * @apiSuccess {String} id Campaign UUID
   * @apiSuccess {Date} startDate First day of campaign (not necessarily createdAt date)
   * @apiSuccess {Date} endDate Last day of campaign
   * @apiSuccess {Integer} currentDay Current step of campaign (default: 0)
   * @apiSuccess {String} length '15', '30', '90'
   * @apiSuccess {String} difficultyLevel 'easy', 'hard', 'xtreme'
   * @apiSuccess {String} randomEvents 'low', 'mid', 'high'
   * @apiSuccess {Integer} numPlayers
   * @apiSuccess {Integer[]} stepTargets array of steps each player needs to complete per day
   * @apiSuccess {Object} inventory
   * @apiSuccess {Integer} inventory.foodItems
   * @apiSuccess {Integer} inventory.medicineItems
   * @apiSuccess {Integer} inventory.weaponItems
   * @apiSuccess {Player[]} players array of player instances associated with this game (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
       "id": "9801ce7c-ad31-4c7e-ab91-fe53e65642c5",
       "startDate": "2019-02-08",
       "endDate": "2019-03-10",
       "currentDay": 0,
       "length": "30",
       "difficultyLevel": "hard",
       "randomEvents": "low",
       "numPlayers": 3,
       "stepTargets": [
           6000,
           0, ...
       ],
       "inventory": {
           "foodItems": 0,
           "weaponItems": 0,
           "medicineItems": 0
       },
       "players": [...]
   }
  */
  app.patch('/api/campaigns/join/:campaignId', appKeyCheck, fetchCampaign, fetchPlayer, function (req, res) {
    co(async function() {
      let campaign = req.campaign
      let player = req.player
      console.log(player)
      let len = parseInt(campaign.length)
      if (campaign.numPlayers == 5) {
        return res.json({ error: `Sorry, this campaign is full.`})
      }
      campaign.addPlayer(player)
      campaign.numPlayers++
      player.update(player.initCampaign(len))
      await campaign.save()
      let json = await campaign.toJson()
      res.io.in(campaign.id).emit('sendCampaignInfo', json)
      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error joining game' })
    })
  })

  /**
   * @api {patch} /api/campaigns/leave/:campaignId Leave Campaign
   * @apiName Leave Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -d '{ "playerId": "7dd089c0-7f4b-4f39-a662-53554834a8f7" }' https://walkertrekker.herokuapp.com/api/campaigns/leave/58568813-712d-451b-9125-4103c6f1d7e5
   *
   * @apiSuccess {String} id Campaign UUID
   * @apiSuccess {Date} startDate First day of campaign (not necessarily createdAt date)
   * @apiSuccess {Date} endDate Last day of campaign
   * @apiSuccess {Integer} currentDay Current step of campaign (default: 0)
   * @apiSuccess {String} length '15', '30', '90'
   * @apiSuccess {String} difficultyLevel 'easy', 'hard', 'xtreme'
   * @apiSuccess {String} randomEvents 'low', 'mid', 'high'
   * @apiSuccess {Integer} numPlayers
   * @apiSuccess {Integer[]} stepTargets array of steps each player needs to complete per day
   * @apiSuccess {Object} inventory
   * @apiSuccess {Integer} inventory.foodItems
   * @apiSuccess {Integer} inventory.medicineItems
   * @apiSuccess {Integer} inventory.weaponItems
   * @apiSuccess {Player[]} players array of player instances associated with this game (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
       "id": "9801ce7c-ad31-4c7e-ab91-fe53e65642c5",
       "startDate": "2019-02-08",
       "endDate": "2019-03-10",
       "currentDay": 0,
       "length": "30",
       "difficultyLevel": "hard",
       "randomEvents": "low",
       "numPlayers": 2,
       "stepTargets": [
           6000,
           0, ...
       ],
       "inventory": {
           "foodItems": 0,
           "weaponItems": 0,
           "medicineItems": 0
       },
       "players": [...]
   }
  */
  app.patch('/api/campaigns/leave/:campaignId', appKeyCheck, fetchCampaign, fetchPlayer, function(req, res) {
    co(async function() {
      let player = req.player
      let campaign = req.campaign
      campaign.removePlayer(player)
      await player.update({
        health: null,
        hunger: null,
        steps: null,
        inActiveGame: false,
      })
      let numPlayers = campaign.numPlayers - 1
      await campaign.update({
        numPlayers
      })
      let json = await campaign.toJson()
      res.io.in(campaign.id).emit('sendCampaignInfo', json)
      return res.json(json)
    })
  })

  /**
   * @api {patch} /api/campaigns/start/:campaignId Start Campaign
   * @apiName Start Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -d '{ "startNow": true }' https://walkertrekker.herokuapp.com/api/campaigns/start/9801ce7c-ad31-4c7e-ab91-fe53e65642c5
   *
   * @apiSuccess {String} id Campaign UUID
   * @apiSuccess {Date} startDate First day of campaign (not necessarily createdAt date)
   * @apiSuccess {Date} endDate Last day of campaign
   * @apiSuccess {Integer} currentDay Current step of campaign (default: 0)
   * @apiSuccess {String} length '15', '30', '90'
   * @apiSuccess {String} difficultyLevel 'easy', 'hard', 'xtreme'
   * @apiSuccess {String} randomEvents 'low', 'mid', 'high'
   * @apiSuccess {Integer} numPlayers
   * @apiSuccess {Integer[]} stepTargets array of steps each player needs to complete per day
   * @apiSuccess {Object} inventory
   * @apiSuccess {Integer} inventory.foodItems
   * @apiSuccess {Integer} inventory.medicineItems
   * @apiSuccess {Integer} inventory.weaponItems
   * @apiSuccess {Player[]} players array of player instances associated with this game (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
       "id": "9801ce7c-ad31-4c7e-ab91-fe53e65642c5",
       "startDate": "2019-02-08",
       "endDate": "2019-03-10",
       "currentDay": 0,
       "length": "30",
       "difficultyLevel": "hard",
       "randomEvents": "low",
       "numPlayers": 0,
       "stepTargets": [
           6000,
           0, ...
       ],
       "inventory": {
           "foodItems": 0,
           "weaponItems": 0,
           "medicineItems": 0
       },
       "players": [...]
   }
  */
  app.patch('/api/campaigns/start/:campaignId', appKeyCheck, fetchCampaign, function(req, res) {
    co(async function() {
      let campaign = req.campaign
      const len = parseInt(campaign.length)
      const startDate = new Date();
      startDate.setHours(0,0,0,0);
      if (!req.body.startNow) { startDate.setDate(startDate.getDate() + 1); }
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + len-1);
      endDate.setHours(0,0,0,0)
      await campaign.update({
        startDate,
        endDate,
      })
      let players = await campaign.getPlayers()
      for (let player of players) {
        await player.update({ invited: [] })
      }
      let json = await campaign.toJson()
      res.io.in(campaign.id).emit('sendCampaignInfo', json)
      res.io.in(campaign.id).emit('campaignStarted', json)
      return res.json(json)
    }).catch(function(err) {
      console.log(err)
      return res.json({ error: 'Error starting game.' })
    })
  })

  /**
   * @api {patch} /api/campaigns/:campaignId Update Campaign
   * @apiName Update Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -d '{ "campaignUpdate": { "currentDay": 1, "inventory": { "foodItems": 5 } } }' https://walkertrekker.herokuapp.com/api/campaigns/58568813-712d-451b-9125-4103c6f1d7e5
   *
   * @apiSuccess {String} id Campaign UUID
   * @apiSuccess {Date} startDate First day of campaign (not necessarily createdAt date)
   * @apiSuccess {Date} endDate Last day of campaign
   * @apiSuccess {Integer} currentDay Current step of campaign (default: 0)
   * @apiSuccess {String} length '15', '30', '90'
   * @apiSuccess {String} difficultyLevel 'easy', 'hard', 'xtreme'
   * @apiSuccess {String} randomEvents 'low', 'mid', 'high'
   * @apiSuccess {Integer} numPlayers
   * @apiSuccess {Integer[]} stepTargets array of steps each player needs to complete per day
   * @apiSuccess {Object} inventory NOTE: if updating at least one inventory item, need to specify EACH in the body of your update.
   * @apiSuccess {Integer} inventory.foodItems
   * @apiSuccess {Integer} inventory.medicineItems
   * @apiSuccess {Integer} inventory.weaponItems
   * @apiSuccess {Player[]} players array of player instances associated with this game
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
       "id": "9801ce7c-ad31-4c7e-ab91-fe53e65642c5",
       "startDate": "2019-02-08",
       "endDate": "2019-03-10",
       "currentDay": 1,
       "length": "30",
       "difficultyLevel": "hard",
       "randomEvents": "low",
       "numPlayers": 0,
       "stepTargets": [
           6000,
           0, ...
       ],
       "inventory": {
           "foodItems": 5,
           "weaponItems": 0,
           "medicineItems": 0
       },
       "players": [...]
   }
  */
  app.patch('/api/campaigns/:campaignId', appKeyCheck, fetchCampaign, function(req, res) {
    co(function*() {
      let campaign = req.campaign
      campaign.update(req.body.campaignUpdate)
      let json = yield campaign.toJson()
      res.io.in(campaign.id).emit('sendCampaignInfo', json)
      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error updating game' })
    })
  })

  /**
   * @api {post} /api/campaigns/invite/:campaignId Invite To Campaign
   * @apiName Invite To Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -d '{ "playerId": "7dd089c0-7f4b-4f39-a662-53554834a8f7", "phoneNumber": "5035558989", "link": "(this is optional)" }' https://walkertrekker.herokuapp.com/api/campaigns/invite/58568813-712d-451b-9125-4103c6f1d7e5
   *
   * @apiSuccess {String} msg Success
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
     "msg": "SMS invite sent to phone number +15035558989"
   }
  */
  app.post('/api/campaigns/invite/:campaignId', appKeyCheck, fetchCampaign, fetchPlayer, lookupPhone, checkPlayerInActiveCampaign, function(req, res) {
    co(function*() {
      if (req.player == 'No player found') {
        return res.json({ error: 'No player found with specified playerId, cannot send invite.'})
      }
      if (res.error) {
        return res.json(res.error)
      }
      let campaign = req.campaign
      const contactAlreadyInvited = (req.player.invited.indexOf(req.phoneNumber) > -1)
      if (contactAlreadyInvited) {
        return res.json({ error: 'That contact has already received an invitation from this player to join a campaign and cannot be invited again.'})
      }
      const link = req.body.link ? req.body.link : `walkertrekker://invite?campaignId=${campaign.id}`
      campaign.sendInvite(req.player, req.phoneNumber, link)
      const newInvited = [...req.player.invited, req.phoneNumber]
      req.player.update({ invited: newInvited })
      return res.json({ msg: `SMS invite sent to phone number ${req.phoneNumber}.` })
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error sending message' })
    })
  })

  /**
   * @api {delete} /api/campaigns/:campaignId Destroy Campaign
   * @apiName Destroy Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X DELETE -H "Content-type: application/json" -H "appkey: abc" https://walkertrekker.herokuapp.com/api/campaigns/58568813-712d-451b-9125-4103c6f1d7e5
   *
   * @apiSuccess {String} msg Success
   * @apiSuccess {Player[]} players Array of player instances previously associated with this game
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
     "msg": "Campaign 58568813-712d-451b-9125-4103c6f1d7e5 has been deleted from database",
     "players": [...]
   }
  */
  app.delete('/api/campaigns/:campaignId', appKeyCheck, fetchCampaign, function(req, res) {
    co(function*() {
      let campaign = req.campaign
      let campaignId = campaign.id
      let players = yield campaign.getPlayers()
      let json = {
        players: [],
        msg: `Campaign ${campaignId} has been deleted from database.`
      }
      for (let player of players) {
        player.update({
          campaignId: null,
          health: null,
          hunger: null,
          steps: null,
          inActiveGame: false,
        })
        let playerData = player.toJson()
        json.players.push(playerData)
      }
      campaign.destroy()
      res.io.in(campaign.id).emit('sendCampaignInfo', json)
      res.io.in(campaign.id).emit('campaignDeleted', json)
      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error deleting campaign.' })
    })
  })

}

module.exports = campaignsRouter

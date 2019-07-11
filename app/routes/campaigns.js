const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchCampaign, fetchPlayer, lookupPhone, checkPlayerInActiveCampaign, } = require('../middlewares');
const { sendNotifications } = require('../util/notifications');
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
   * @apiSuccess {Integer[]} inventory.foodItems
   * @apiSuccess {Integer[]} inventory.medicineItems
   * @apiSuccess {Integer[]} inventory.weaponItems
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
           "foodItems": [],
           "weaponItems": [],
           "medicineItems": []
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
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -d '{ "playerId": "c1e1ee53-ae51-423c-b07d-9a98f74f1cfa", "timezone": -8, "params": { "campaignLength": "30", "difficultyLevel": "hard", "randomEvents": "low" } }' https://walkertrekker.herokuapp.com/api/campaigns
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
   * @apiSuccess {Integer[]} inventory.foodItems
   * @apiSuccess {Integer[]} inventory.medicineItems
   * @apiSuccess {Integer[]} inventory.weaponItems
   * @apiSuccess {String} host PlayerId of the player that started the campaign
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
           "foodItems": [],
           "weaponItems": [],
           "medicineItems": []
       },
       "players": [
          {
            "id": "c1e1ee53-ae51-423c-b07d-9a98f74f1cfa",
            ...
          },
       ],
       "host": "c1e1ee53-ae51-423c-b07d-9a98f74f1cfa"
   }
  */
  app.post('/api/campaigns/', appKeyCheck, fetchPlayer, function(req, res) {
    co(async function () {
      if (req.player == 'No player found') {
        return res.json({ error: 'No player found with given playerId, cannot create campaign.' })
      }
      let player = req.player
      console.log(" +++++ new player before ADDPLAYER +++++", player);

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
        inventory: { foodItems: [], medicineItems: [], weaponItems: [] },
        host: player.id,
        timezone: req.body.timezone,
        completedEvents: [],
      })
      await newCampaign.addPlayer(player.id)
      player = await player.update(player.initCampaign(len), {
        returning: true,
      })
      .then(function (result) {
        console.log(typeof result);
        
        return result.dataValues
      });
      console.log(typeof player);
      console.log("+++++++++ PLAYER UPDATE +++++++++++", player)
      let json = await newCampaign.toJson()
      
      res.io.in(player.id).emit('sendPlayerInfo', player)
      return res.json(json)
    })
    .catch(function (err) {
      console.log(err)
      res.json({ error: 'Error creating a game' })
    })
  })

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
   * @apiSuccess {Integer[]} inventory.foodItems
   * @apiSuccess {Integer[]} inventory.medicineItems
   * @apiSuccess {Integer[]} inventory.weaponItems
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
           "foodItems": [],
           "weaponItems": [],
           "medicineItems": []
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
   * @apiSuccess {Integer[]} inventory.foodItems
   * @apiSuccess {Integer[]} inventory.medicineItems
   * @apiSuccess {Integer[]} inventory.weaponItems
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
           "foodItems": [],
           "weaponItems": [],
           "medicineItems": []
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
   * @apiSuccess {Integer[]} inventory.foodItems
   * @apiSuccess {Integer[]} inventory.medicineItems
   * @apiSuccess {Integer[]} inventory.weaponItems
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
           "foodItems": [],
           "weaponItems": [],
           "medicineItems": []
       },
       "players": [...]
   }
  */
  app.patch('/api/campaigns/start/:campaignId', appKeyCheck, fetchCampaign, function(req, res) {
    co(async function() {
      let campaign = req.campaign
      const len = parseInt(campaign.length)
      const startDate = new Date();
      const hourAdjust = startDate.getUTCHours() + campaign.timezone
      startDate.setUTCHours(hourAdjust)
      if (!req.body.startNow) { startDate.setDate(startDate.getDate() + 1); }
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + len);
      endDate.setHours(0,1,0,0)
      await campaign.update({
        startDate,
        endDate,
      })
      let players = await campaign.getPlayers()
      const messages = []
      for (let player of players) {
        await player.update({ invited: [], stepTargets: campaign.stepTargets })
        if (player.pushToken) {
          const message = {
            to: player.pushToken,
            sound: 'default',
            body: `Your Walker Trekker campaign has begun.`,
            data: {
              type: 'campaignStarted',
              data: {}
            }
          }
          messages.push(message)
        }
      }
      console.log('messages', messages)
      await sendNotifications(messages)
      let json = await campaign.toJson()
      res.io.in(campaign.id).emit('sendCampaignInfo', json)
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
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -d '{ "campaignUpdate": { "currentDay": 1, "inventory": { "foodItems": [1,5,0,8,4], "medicineItems": [], "weaponItems": [3] } } }' https://walkertrekker.herokuapp.com/api/campaigns/58568813-712d-451b-9125-4103c6f1d7e5
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
   * @apiSuccess {Integer[]} inventory.foodItems
   * @apiSuccess {Integer[]} inventory.medicineItems
   * @apiSuccess {Integer[]} inventory.weaponItems
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
           "foodItems": [1,5,0,8,4],
           "weaponItems": [3],
           "medicineItems": []
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
  app.post('/api/campaigns/invite/:campaignId', appKeyCheck, fetchCampaign, fetchPlayer, lookupPhone,  function(req, res) {
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
      const link = req.body.link ? req.body.link : `exp://mu-p87.kimofthecode.walkertreker.exp.direct:80/--/join?campaignId=${campaign.id}`
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
    co(async function() {
      let campaign = req.campaign
      let campaignId = campaign.id
      let players = await campaign.getPlayers()
      let json = {
        players: [],
        msg: `Campaign ${campaignId} has been deleted from database.`
      }
      const messages = []
      for (let player of players) {
        player.update({
          campaignId: null,
          health: null,
          hunger: null,
          steps: null,
          stepTargets: null,
          inActiveGame: false,
        })
        let playerData = player.toJson()
        json.players.push(playerData)
        if (player.pushToken) {
          const message = {
            to: player.pushToken,
            body: 'The host of your campaign has abandoned the game.',
            sound: 'default',
            data: {
              type: 'campaignDeleted',
              data: {}
            }
          }
        }
      }
      await sendNotifications(messages)
      campaign.destroy()
      res.io.in(campaign.id).emit('sendCampaignInfo', json)
      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error deleting campaign.' })
    })
  })

  // app.patch('/api/campaigns/endOfDayUpdate/:campaignId', appKeyCheck, fetchCampaign, async function(req, res) {
  //   try {
  //     const campaign = req.campaign
  //     const prev = req.body.prevState
  //     const updated = req.body.updatedState
  //
  //     let result = {
  //       players: [],
  //       inventoryDiff: {}
  //     }
  //     const prevDay = prev.currentDay
  //     for (let player of prev.players) {
  //       const prevPlayer = player
  //       const filteredPlayers = updated.players.filter(player => player.id === prevPlayer.id)
  //       const updatedPlayer = filteredPlayers[0]
  //       const playerInfo = {
  //         id: player.id,
  //         displayName: player.displayName,
  //         healthDiff: prevPlayer.health - updatedPlayer.health,
  //         stepsDiff: prevPlayer.steps[prevDay] - prevPlayer.stepTargets[prevDay]
  //       }
  //       result.players.push(playerInfo)
  //     }
  //     Object.keys(prev.inventory).forEach(item => {
  //       result.inventoryDiff = Object.assign({}, result.inventoryDiff, {
  //         [item]: prev.inventory[item] - updated.inventory[item]
  //       })
  //     })
  //
  //     for (let player of result.players) {
  //       if (player.health <= 0) {
  //         console.log(`${player.displayName} died. The game is over.`)
  //         const json = await campaign.toJson()
  //         res.io.in(campaign.id).emit('log', `msg from server: ${player.displayName} died. The game is over.`)
  //         res.io.in(campaign.id).emit('campaignIsLost', json)
  //         return res.json({ msg: `${player.displayName} died. The game is over.` })
  //       }
  //     }
  //
  //     console.log(result)
  //     const json = await campaign.toJson()
  //     res.io.in(campaign.id).emit('sendCampaignInfo', json)
  //     res.io.in(campaign.id).emit('endOfDayUpdate', result)
  //     return res.json({ msg: 'Feelin fine' })
  //   }
  //   catch (err) {
  //     console.log(err)
  //     res.json({ error: 'Error in end of day update '})
  //   }
  // })

}

module.exports = campaignsRouter

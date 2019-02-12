const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchCampaign, fetchPlayer, lookupPhone } = require('../middlewares');
const Campaign = sequelize.import('../models/campaign');

function campaignsRouter (app) {

  /**
   * @api {get} /api/campaigns/ Fetch Campaign
   * @apiName Fetch Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" -d "{ campaignId: '4028d623-e955-4b16-a7e4-88b555c6cdf3' }" https://walkertrekker.herokuapp.com/api/campaigns
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
  app.get('/api/campaigns', appKeyCheck, fetchCampaign, function(req, res) {
    co(function * () {
      let json = yield req.campaign.toJson();
      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error fetching a game' })
    })
  })

  /**
   * @api {post} /api/campaigns Create New Campaign
   * @apiName Create New Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" -d '{ "params": { "campaignLength": "30", "difficultyLevel": "hard", "randomEvents": "low", "startNow": true } }' https://walkertrekker.herokuapp.com/api/campaigns
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
  app.post('/api/campaigns', appKeyCheck, function(req, res) {
    co(function * () {
      const params = req.body.params
      const len = parseInt(params.campaignLength)
      let stepTargets = [];
      for (let i = 0; i < len; i++) {stepTargets[i] = 0}
      if (params.difficultyLevel == 'easy') {stepTargets[0] = 2000} // assuming 1 mile - 2000 steps
      else if (params.difficultyLevel == 'hard') {stepTargets[0] = 6000}
      else {stepTargets[0] = 10000}
      const startDate = new Date();
      startDate.setHours(0,0,0,0);
      if (!params.startNow) startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + len-1);
      endDate.setHours(0,0,0,0)

      const newCampaign = Campaign.build({
        id: uuid.v4(),
        startDate,
        endDate,
        currentDay: 0,
        length: params.campaignLength,
        difficultyLevel: params.difficultyLevel,
        randomEvents: params.randomEvents,
        numPlayers: 0,
        stepTargets,
        inventory: { foodItems: 0, medicineItems: 0, weaponItems: 0 }
      })
      let json = yield newCampaign.toJson()
      newCampaign.save()
      return res.json(json)
    }).catch(function (err) {
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
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" -d '{ "campaignId": "9801ce7c-ad31-4c7e-ab91-fe53e65642c5", "playerId": "7dd089c0-7f4b-4f39-a662-53554834a8f7" }' https://walkertrekker.herokuapp.com/api/campaigns/join/
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
  app.patch('/api/campaigns/join', appKeyCheck, fetchCampaign, fetchPlayer, function (req, res) {
    co(function*() {
      campaign = req.campaign
      player = req.player
      campaign.addPlayer(player)
      campaign.numPlayers++
      player.inActiveGame = true
      player.hunger = 100
      player.health = 100
      let steps = []
      for (let i=0; i < parseInt(campaign.length); i++) {
        steps[i] = 0
      }
      player.steps = steps
      player.save()
      campaign.save()
      let json = yield campaign.toJson();
      return res.json(json);
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error updating game' })
    })
  })

  /**
   * @api {post} /api/campaigns/invite Invite To Campaign
   * @apiName Invite To Campaign
   * @apiGroup Campaigns
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" -d '{ "campaignId": "9801ce7c-ad31-4c7e-ab91-fe53e65642c5", "playerId": "7dd089c0-7f4b-4f39-a662-53554834a8f7", "number": "5035558989", "link": "(this is optional)" }' https://walkertrekker.herokuapp.com/api/campaigns/join/
   *
   * @apiSuccess {String} msg: Success
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   {
     "msg": "SMS invite sent to phone number +15035558989"
   }
  */

  app.post('/api/campaigns/invite', appKeyCheck, fetchCampaign, fetchPlayer, lookupPhone, function(req, res) {
    co(function*() {
      let campaign = req.campaign
      const link = req.body.link ? req.body.link : `walkertrekker://invite/`
      campaign.sendInvite(req.player, req.phoneNumber, link)
      return res.json({ msg: `SMS invite sent to phone number ${req.phoneNumber}.` })
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error sending message' })
    })
  })
}

module.exports = campaignsRouter

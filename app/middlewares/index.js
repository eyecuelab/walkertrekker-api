const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const op = sequelize.Op
require('dotenv').config()

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const Twilio = require('twilio')
const client = Twilio(twilioAccountSid, twilioAuthToken)

const Player = sequelize.import('../models/player')
const Campaign = sequelize.import('../models/campaign')

function appKeyCheck (req, res, done) {
  if (req.headers['appkey'] !== process.env.CLIENT_APP_KEY) {
    return res.json({ error: "Unauthorized, invalid client app key."})
  } else { done() }
}

function fetchAllPlayers (req, res, done) {
  Player.findAll()
  .then(function(players) {
    if (players.length == 0) return res.json({ error: 'No players found' })
    req.players = players
    done()
  })
}

function fetchPlayer (req, res, done) {
  Player.findOne({
    where: {
      [op.or]: [
        {displayName: req.body.displayName},
        {id: req.body.playerId},
        {phoneNumber: req.body.phoneNumber}
      ]
    }
  })
  .then(function(player) {
    req.player = player
    done();
  })
}

function fetchCampaign (req, res, done) {
  Campaign.findOne({
    where: { id: req.body.campaignId }
  }).then(function(campaign) {
    req.campaign = campaign
    done()
  })
}

function lookupPhone (req, res, done) {
  client.lookups.phoneNumbers(req.body.phoneNumber).fetch()
  .then(phone => {
    req.phoneNumber = phone.phoneNumber
    req.sid = phone.sid
    done()
  }).catch(err => { res.error = err; done() })
}

function checkPlayerInActiveCampaign (req, res, done) {
  Player.findOne({
    where: { phoneNumber: req.phoneNumber }
  }).then(function(player) {
    if (player.campaignId != null) {
      return res.json({ error: 'This player is already in an active campaign and cannot be invited.' })
    } else {
      done()
    }
  })
}

module.exports = {
  appKeyCheck,
  fetchAllPlayers,
  fetchPlayer,
  fetchCampaign,
  lookupPhone,
  checkPlayerInActiveCampaign,
}

// function twilioPhoneLookup (phone, cb) {
//   lookupsClient.phoneNumbers(phone).get(cb)
// }
//
// function normalizePhoneNumber (req, res, done) {
  //   User.twilioPhoneLookup(req.body.phone, function (err, number) {
    //     if (err) return res.json({ error: 'Invalid phone number' })
    //
    //     req.body.phone = number.phoneNumber
    //     done()
    //   })
    // }
    //
    // function loginRequired (req, res, done) {
      //   User.findOne({ where: { authToken: req.headers['auth_token'] } }).then(function (user) {
        //     if (!user) return res.status(401).json({ error: 'Get lost!!' })
        //
        //     req.user = user
        //     done()
        //   })
        // }
        //
        // function fetchOpenGame (req, res, done) {
          //   Game.findOne({ where: { opponentId: null }, order: [['createdAt', 'desc']] }).then(function (game) {
            //     req.game = game
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

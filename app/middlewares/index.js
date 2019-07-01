const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const op = sequelize.Op
require('dotenv').config()

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const Twilio = require('twilio')
const client = Twilio(twilioAccountSid, twilioAuthToken)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' }).single('avatar')

const Player = sequelize.import('../models/player')
const Campaign = sequelize.import('../models/campaign')

function appKeyCheck (req, res, done) {
  if (req.headers['appkey'] !== process.env.CLIENT_APP_KEY) {
    return res.json({ error: "Unauthorized, invalid client app key."})
  } else { done() }
}

function fetchPlayer (req, res, done) {
  Player.findOne({
    where: {id: req.body.playerId }
  })
  .then(function(player) {
    if (player == null) {
      req.player = 'No player found'
    } else {
      req.player = player
    }
    done();
  })
}

function checkDuplicateNum (req, res, done) {
  console.log('check dupe')
  Player.findOne({
    where: { phoneNumber: req.body.phoneNumber }
  })
  .then(function(number) {
    if (number == null) {
      console.log('no number found')
      req.number = 'No number found'
    } else {
      console.log('check dupe')
      req.number = number
    }
    done();
  })
}


function fetchCampaign (req, res, done) {
  Campaign.findOne({
    where: { id: req.params.campaignId }
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


//this will be fixed be requiring each number to only be used once
//CURRENTLY there is an issue if the same number exists twice, only grabs first instance
function checkPlayerInActiveCampaign (req, res, done) {
  Player.findOne({
    where: { phoneNumber: req.phoneNumber }
  }).then(function(player) {
    if (player == null) { done() }
    else if (player.inActiveGame == true) {
      return res.json({ error: 'This player is already in an active campaign and cannot be invited.'})
    } else { done() }
  })
}

function getImage (req, res, done) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
      res.error = 'Error in getImage'
    } else if (err) {
      console.log(err)
      res.error = 'Error in getImage'
    }
  })
  done()
}

module.exports = {
  appKeyCheck,
  fetchPlayer,
  checkDuplicateNum,
  fetchCampaign,
  lookupPhone,
  checkPlayerInActiveCampaign,
  getImage,
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

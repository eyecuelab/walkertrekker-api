const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const op = sequelize.Op

const Player = sequelize.import('../models/player')
const Campaign = sequelize.import('../models/campaign')

function fetchAllPlayers (req, res, done) {
  Player.findAll()
  .then(function(players) {
    if (!players) return res.status(401).json({ error: 'Nope.' })
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

module.exports = {
  fetchAllPlayers,
  fetchPlayer,
  fetchCampaign,
}

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

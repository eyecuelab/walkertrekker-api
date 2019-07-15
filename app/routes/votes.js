const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchVote, fetchEvent, checkPlayerHasVoted } = require('../middlewares');
const { sendNotifications } = require('../util/notifications');
const Campaign = sequelize.import('../models/campaign');
const Player = sequelize.import('../models/player');
const Event = sequelize.import('../models/event');
const Vote = sequelize.import('../models/vote');



function votesRouter (app) {

  app.get('/api/votes/:voteId', appKeyCheck, fetchVote, function(req, res) {
    console.log("in api/vote", req.vote)
    co(function * () {
        if (req.vote == null) {
          return res.json({ error: 'No vote found with specified voteId'})
        }
        let json = yield req.vote.toJson();
        return res.json(json)
      }).catch(function (err) {
        console.log(err)
      res.json({ error: 'Error fetching vote' })
      })
    }
  )

  app.post('/api/votes/:eventId', appKeyCheck, fetchEvent, checkPlayerHasVoted, async function(req, res) {
    co(async function() {
      if (req.event == 'No event found') {
        return res.json({ error: 'No event found with given eventId, cannot create vote.' })
      }
      if (req.vote == 'vote found') {
        return res.json({ error: 'That player has already cast a vote' })
      }
      console.log(req.event)
      console.log('now building vote')
      const newVote = await Vote.create({
        id: uuid.v4(),
        vote: req.body.vote,
        playerId: req.body.playerId,
        eventId: req.params.eventId,
      })
      let json = newVote.toJson();
      return res.json(json)
    }).then(function (result) {
      console.log("type of", typeof result);
      return result.dataValues
    }).catch((error) => {
      return res.json({ error: "Error creating new Vote" })
    })
  })
}


module.exports = votesRouter

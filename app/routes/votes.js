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

  /**
   * @api {get} /api/votes/:voteId Fetch Vote
   * @apiName Fetch Vote
   * @apiGroup Votes
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" http://walkertrekker.herokuapp.com/api/votes/:voteId
   *
   * @apiSuccess {String} id Vote UUID
   * @apiSuccess {String} vote Player's binary vote, either "A" or "B"
   * @apiSuccess {String} eventId UUID of associated event
   * @apiSuccess {String} playerId UUID of associated player
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "vote": "A",
   *    "eventId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "playerId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *  }
  */
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

  /**
   * @api {post} /api/votes/:eventId Create Vote
   * @apiName Create Vote
   * @apiGroup Votes
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -d '{ "vote": "A", "playerId": ":playerId" }'  http://walkertrekker.herokuapp.com/api/votes/:eventId
   *
   * @apiSuccess {String} id Vote UUID
   * @apiSuccess {String} vote Player's binary vote, either "A" or "B"
   * @apiSuccess {String} eventId UUID of associated event
   * @apiSuccess {String} playerId UUID of associated player
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "vote": "A",
   *    "eventId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "playerId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *  }
  */
  app.post('/api/votes/:eventId', appKeyCheck, fetchEvent, checkPlayerHasVoted, async function(req, res) {
    co(async function() {
      if (req.event == 'No event found') {
        console.log('noEvent')
        return res.json({ error: 'No event found with given eventId, cannot create vote.' })
      }
      if (req.vote == 'vote found') {
        console.log('doubleVote')
        return res.json({ error: 'That player has already cast a vote' })
      }
      console.log(req.event)
      console.log(req.vote)
      console.log('now building vote')
      const newVote = await Vote.create({
        id: uuid.v4(),
        vote: req.body.vote,
        playerId: req.body.playerId,
        eventId: req.params.eventId,
      })
      newVote.save()
      let json = newVote.toJson();
      return res.json(json)
    }).then(function (result) {
      console.log("result", result.req.body)
      console.log("type of", typeof result);
      return result.dataValues
    }).catch((error) => {
      return res.json({ error: "Error creating new Vote" })
    })
  })
}


module.exports = votesRouter

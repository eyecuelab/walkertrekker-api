const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchJournal, fetchCampaign } = require('../middlewares');

const Journal = sequelize.import('../models/journal');



function journalsRouter (app) {

  /**
   * @api {get} /api/journals/:journalId Fetch Journal
   * @apiName Fetch Journal
   * @apiGroup Journals
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/journals/:journalId
   *
   * @apiSuccess {String} id Journal UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {String} entry Main text of the journal
   * @apiSuccess {Integer} eventNumber Event the entry was generated from -- if no number, journal was generated from EndOfDayUpdate
   * @apiSuccess {Integer} entryDay Campaign day the entry was generated on
   * @apiSuccess {String[]} votingList List of strings describing how each player voted, displayed by journal
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "entry": "The street you grew up on–how changed is the world that you didn't recognize it? There's your house. So many memories... "
   *    "eventNumber": 19,
   *    "entryDay": 2,
   *    "votingList": [
   *       "Kim voted to Run", 
   *       "Wilt voted to Help"
   *    ]
   *  }
  */
  app.get('/api/journals/:journalId', appKeyCheck, fetchJournal, function(req, res) {
    console.log("in api/journal", req.journal)
    co(function * () {
        if (req.journal == null) {
          return res.json({ error: 'No journal found with specified journalId'})
        }
        let json = yield req.journal.toJson();
        return res.json(json)
      }).catch(function (err) {
        console.log(err)
      res.json({ error: 'Error fetching journal' })
      })
    }
  )

  /**
   * @api {post} /api/journals/:campaignId Create Journal
   * @apiName Create Journal
   * @apiGroup Journals
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/journals/:campaignId
   *
   * @apiSuccess {String} id Journal UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {String} entry Main text of the journal
   * @apiSuccess {Integer} eventNumber Event the entry was generated from -- if no number, journal was generated from EndOfDayUpdate
   * @apiSuccess {Integer} entryDay Campaign day the entry was generated on
   * @apiSuccess {String[]} votingList List of strings describing how each player voted, displayed by journal
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "entry": "The street you grew up on–how changed is the world that you didn't recognize it? There's your house. So many memories... "
   *    "eventNumber": 19,
   *    "entryDay": 2,
   *    "votingList": []
   *  }
  */
  app.post('/api/journals/:campaignId', appKeyCheck, fetchCampaign, async function(req, res) {
    co(async function() {
      if (req.camapign == 'No camapign found') {
        return res.json({ error: 'No event found with given camapignId, cannot create journal.' })
      }
      console.log('now building journal')
      const newJournal = await Journal.create({
        id: uuid.v4(),
        entry: req.body.entry,
        eventNumber: req.body.eventNumber,
        entryDay: req.body.entryDay,
        campaignId: req.campaign.id,
        votingList: req.body.votingList,
      })
      newJournal.save()
      let json = newJournal.toJson();
      return res.json(json)
    }).then(function (result) {
      console.log("type of", typeof result);
      return result.dataValues
    }).catch((error) => {
      return res.json({ error: "Error creating new journal" })
    })
  })

  /**
   * @api {patch} /api/journals/:journalId Update Journal
   * @apiName Update Journal
   * @apiGroup Journals
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/journals/:journalId
   *
   * @apiSuccess {String} id Journal UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {String} entry Main text of the journal
   * @apiSuccess {Integer} eventNumber Event the entry was generated from -- if no number, journal was generated from EndOfDayUpdate
   * @apiSuccess {Integer} entryDay Campaign day the entry was generated on
   * @apiSuccess {String[]} votingList List of strings describing how each player voted, displayed by journal
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "entry": "The street you grew up on–how changed is the world that you didn't recognize it? There's your house. So many memories... "
   *    "eventNumber": 19,
   *    "entryDay": 2,
   *    "votingList": [
   *       "Kim voted to Run", 
   *       "Wilt voted to Help"
   *    ]
   *  }
  */
  app.patch('/api/journals/:journalId', appKeyCheck, fetchJournal, function(req, res) {
    co(async function () {
      let journal = req.journal
      await journal.update(req.body.journalUpdate)
      let json = await journal.toJson()
      return res.json(json)
    }).catch(function(err) {
      console.log(err)
      return res.json({ error: 'Error updating journal info' })
    })
  })

}


module.exports = journalsRouter

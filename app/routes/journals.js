const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchJournal, fetchEvent, fetchCampaign, fetchPlayer } = require('../middlewares');
const { sendNotifications } = require('../util/notifications');
const Campaign = sequelize.import('../models/campaign');
const Player = sequelize.import('../models/player');
const Event = sequelize.import('../models/event');
const Journal = sequelize.import('../models/journal');



function journalsRouter (app) {

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

  

  app.post('/api/journals/:campaignId', appKeyCheck, fetchCampaign, async function(req, res) {
    co(async function() {
      if (req.camapign == 'No camapign found') {
        return res.json({ error: 'No event found with given camapignId, cannot create journal.' })
      }
      console.log('now building journal')
      const newJournal = await Journal.create({
        id: uuid.v4(),
        entry: req.body.entry,
        entryDay: req.body.entryDay,
        campaignId: req.campaign.id,
      })
      let json = newJournal.toJson();
      return res.json(json)
    }).then(function (result) {
      console.log("type of", typeof result);
      return result.dataValues
    }).catch((error) => {
      return res.json({ error: "Error creating new journal" })
    })
  })

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

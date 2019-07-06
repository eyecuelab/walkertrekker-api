const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchEvent, fetchCampaign } = require('../middlewares');
const { sendNotifications } = require('../util/notifications');
const Campaign = sequelize.import('../models/campaign');
const Player = sequelize.import('../models/player');
const Event = sequelize.import('../models/event');



function eventsRouter (app) {

  app.get('/api/events/:eventId', appKeyCheck, fetchEvent, function(req, res) {
    co(function * () {
        if (req.event == null) {
          return res.json({ error: 'No event found with specified eventId'})
        }
        let json = yield req.event.toJson();
        return res.json(json)
      }).catch(function (err) {
        console.log(err)
      res.json({ error: 'Error fetching an event' })
      })
    }
  )

  app.post('/api/events/:campaignId', appKeyCheck,  async function(req, res) {
    co(async function() {
    
      console.log('now building event')
      const newEvent = await Event.create({
        id: uuid.v4(),
        eventNumber: req.body.eventNumber,
        story: req.body.story,
        active: req.body.active,
        campaignId: req.params.campaignId,
      })
      let json = newEvent.toJson();
      return res.json(json)
    }).then(function (result) {
      return result.dataValues
    }).catch((error) => {
      return res.json({ error: "Error creating new Event" })
    })
  })

  app.patch('/api/events/:eventId', appKeyCheck, fetchEvent, async function(req, res) {
    co(async function() {
      let event = req.event
      console.log('now updating event')
      await event.update(req.body.eventUpdate)
      let json = await event.toJson();
      return res.json(json)
    }).catch((error) => {
      return res.json({ error: "Error updating Event" })
    })
  })

}


module.exports = eventsRouter

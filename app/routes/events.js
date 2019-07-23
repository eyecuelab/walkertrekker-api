const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchEvent, fetchCampaign, fetchEventsOfCampaign } = require('../middlewares');
const { sendNotifications } = require('../util/notifications');
const Campaign = sequelize.import('../models/campaign');
const Player = sequelize.import('../models/player');
const Event = sequelize.import('../models/event');



function eventsRouter (app) {


  app.get('/api/events/campaign/:campaignId', appKeyCheck, fetchCampaign, async function(req, res) {
    co(async function() {
      if (req.campaign == null) {
        return res.json({ error: 'No campaign found with specified campaignId'})
      }
      try {
        async function formatEvents(events) {
          const pArray = await events.map((event) => { 
            const repsonse = event.toJson()
            return repsonse;
          })
          const eventsWith = await Promise.all(pArray)
          return eventsWith
        }
        let events = await Event.findAll({
          where: {
            campaignId: req.params.campaignId
          }
        })
        let result = await formatEvents(events)
        let json = result
        return res.json(json)
      
    } catch(err) {
      console.log(err)
      res.json({ error: 'Error fetching an event' })
    }
  })
})


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

  

  app.post('/api/events/:campaignId', appKeyCheck, async function(req, res) {
    co(async function() {
      console.log('now building event')
      const newEvent = await Event.create({
        id: uuid.v4(),
        eventNumber: req.body.eventNumber,
        story: req.body.story,
        active: req.body.active,
        campaignId: req.params.campaignId,
      })
      newEvent.save()
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

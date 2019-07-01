const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchEvent, } = require('../middlewares');
const { sendNotifications } = require('../util/notifications');
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
  })


  // just for our use, DO NOT connect to front end
  app.post('/api/events/', appKeyCheck, async function(req, res) {
      try {
        const newEvent = Event.build({
          id: uuid.v4(),
          antecedent: req.body.antecedent,
          optionAButton: req.body.optionAButton,
          optionAResult: req.body.optionAResult,
          optionAText: req.body.optionAText,
          optionBButton: req.body.optionBButton,
          optionBResult: req.body.optionBResult,
          optionBText: req.body.optionBText,
          optionALog: req.body.optionALog,
          optionBLog: req.body.optionBLog,
          storyEvent: req.body.storyEvent          
        })
        newEvent.save()
        let json = newEvent.toJson();
        return res.json(json)
      } catch(error) {
        return res.json({error: 'Error creating new event'})
      }
    })
}

module.exports = eventsRouter
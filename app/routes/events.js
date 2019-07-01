const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchEvent, } = require('../middlewares');
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
  })
  
}

module.exports = eventsRouter
const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchEvent, fetchCampaign } = require('../middlewares');
const Event = sequelize.import('../models/event');



function eventsRouter (app) {

  /**
   * @api {get} /api/events/:eventId Fetch Event
   * @apiName Fetch Event
   * @apiGroup Events
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/events/:eventId
   *
   * @apiSuccess {String} id Event UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {Integer} eventNumber Event number corresponding to an event in front-end
   * @apiSuccess {Boolean} active True if result has not been sent (15 min timer)
   * @apiSuccess {String} story Either 'story' or 'random' event type
   * @apiSuccess {String} createdAt Time created, sent to front end for display timer
   * @apiSuccess {Vote[]} votes array of vote instances associated with this event (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "eventNumber": 19,
   *    "active": false,
   *    "story": "random",
   *    "createdAt": "2019-07-23T01:52:01.509Z",
   *    "votes": [
   *       {
   *         "id": "ccbbca2a-35d2-4288-8d52-10123ab1119a",
   *         "vote": "A",
   *         ...
   *       }
   *    ]
   *  }
  */

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

    /**
   * @api {get} /api/events/campaign/:campaignId Fetch Events in Campaign
   * @apiName Fetch Events in Campaign
   * @apiGroup Events
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/events/campaign/:campaignId
   *
   * @apiSuccess {Event[]} event Return all events in a campaign
   * @apiSuccess {String} event.id Event UUID
   * @apiSuccess {String} event.campaignId UUID of current game
   * @apiSuccess {Integer} event.eventNumber Event number corresponding to an event in front-end
   * @apiSuccess {Boolean} event.active True if result has not been sent (15 min timer)
   * @apiSuccess {String} event.story Either 'story' or 'random' event type
   * @apiSuccess {String} event.createdAt Time created, sent to front end for display timer
   * @apiSuccess {Vote[]} event.votes array of vote instances associated with this event (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  [
   *    { 
   *      "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *      "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *      "eventNumber": 19,
   *      "active": false,
   *      "story": "random",
   *      "createdAt": "2019-07-23T01:52:01.509Z",
   *      "votes": [
   *        {
   *          "id": "ccbbca2a-35d2-4288-8d52-10123ab1119a",
   *          "vote": "A",
   *          ...
   *        },
   *      ]
   *    },
   *    { 
   *      "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *      "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *      ...
   *    },
   *    ...
   *  ]
  
  */
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

  /**
   * @api {post} /api/events/:campaignId Create Event
   * @apiName Create Event
   * @apiGroup Events
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/events/:campaignId
   *
   * @apiSuccess {String} id Event UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {Integer} eventNumber Event number corresponding to an event in front-end
   * @apiSuccess {Boolean} active True if result has not been sent (15 min timer)
   * @apiSuccess {String} story Either 'story' or 'random' event type
   * @apiSuccess {String} createdAt Time created, sent to front end for display timer
   * @apiSuccess {Vote[]} votes array of vote instances associated with this event (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "eventNumber": 19,
   *    "active": true,
   *    "story": "random",
   *    "createdAt": "2019-07-23T01:52:01.509Z",
   *    "votes": []
   *  }
  */
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

  /**
   * @api {post} /api/events/:eventId Update Event
   * @apiName Update Event
   * @apiGroup Events
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/events/:eventId
   *
   * @apiSuccess {String} id Event UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {Integer} eventNumber Event number corresponding to an event in front-end
   * @apiSuccess {Boolean} active True if result has not been sent (15 min timer)
   * @apiSuccess {String} story Either 'story' or 'random' event type
   * @apiSuccess {String} createdAt Time created, sent to front end for display timer
   * @apiSuccess {Vote[]} votes array of vote instances associated with this event (default to [] on creation)
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "eventNumber": 19,
   *    "active": false,
   *    "story": "random",
   *    "createdAt": "2019-07-23T01:52:01.509Z",
   *    "votes": []
   *  }
  */
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

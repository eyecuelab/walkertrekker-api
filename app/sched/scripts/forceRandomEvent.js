require('dotenv').config()

const { sendNotifications } = require('../../util/notifications')
const Sequelize = require('sequelize')
const uuid = require('node-uuid')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Campaign = sequelize.import('../../models/campaign')
const Event = sequelize.import('../../models/event');

const forceRandomEvent = async function() {
  campaignId = "7aa23a80-25ef-4767-ad98-79674f23b30c"
  const campaign = await Campaign.findOne({ where: { id: campaignId } })
  const players = await campaign.getPlayers()
  const campaignJson = await campaign.toJson()
  console.log('CAMPAIGN')
  console.log(campaignJson)
  let messages = []

  const newEvent = await Event.create({
    id: uuid.v4(),
    ///event number defined here so that it shows up in the db
    eventNumber: 3,
    story: 'random',
    active: true,
    campaignId: campaignId,
  })
  let json = await newEvent.toJson();
  let eventObject = json;

  let event = {
    data: {
      eventId: eventObject.id,
      id: eventObject.id,
      //event number defined here so that front end does not break
      eventNumber: 3,
      eventType: 'random',
      active: true,
      campaignId: campaignId,
      type: 'eventStart',
      createdAt: eventObject.createdAt
    }
  }

  for (let player of campaignJson.players) {
    if (player.pushToken) {
      const message = {
        to: player.pushToken,
        sound: 'default',
        body: `Your group has reached a crossroads. Tap to decide how to deal with this latest crisis.`,
        data: {
          type: 'eventStart',
          data: event
        }
      }
      messages.push(message)
    }
  }
  await sendNotifications(messages)
  process.exit(0)
}

forceRandomEvent()

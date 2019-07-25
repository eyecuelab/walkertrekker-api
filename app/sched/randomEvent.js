if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const Event = sequelize.import('../models/event');

const { getAllActiveCampaigns, } = require('../util/getCampaigns')
const { sendNotifications } = require('../util/notifications')


randomEvent = async() => {
  const campaigns = await getAllActiveCampaigns()
  const messages = [];

  if (campaigns.length === 0) {
    process.exit(0)
  }

  console.log('EVENT')
  console.log('==================')

  for (let campaign of campaigns) {

    let eventChance;
    campaign.randomEvents.toString() === 'high' ? eventChance = Math.random() >= 0.5 : campaign.randomEvents.toString() === 'mid' ? eventChance = Math.random() >= 0.7 : 
    eventChance = Math.random() >= 0.85;

    console.log(eventChance)

    if(eventChance) {

      // get players to send notifications to
      let players = await campaign.getPlayers();
      let eventType = null;
      let eventObject = {};

      campaign.length === '15' ? storyFreq = 3 : campaign.length === '30' ? storyFreq = 6 : storyFreq = 12;

      //Story events will start on the first full day of the campaign
      parseInt(campaign.currentDay)-1 % storyFreq ? eventType = 'random' : eventType = 'story';

      const events = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
      const completedEvents = campaign.completedEvents

      // if all events have been done, reset the array before picking one to send
      console.log("CURRENT NUMBER OF COMPLETED EVENTS" ,completedEvents.length)
      if (completedEvents.length >= events.length) {
        console.log("length before", completedEvents.length)
        try {
          await campaign.update({
            completedEvents: []
          })
          let json = await campaign.toJson()
          completedEvents = json.completedEvents
        } catch (err) {
          json = "error updating completed events array: " + err;
        }
        console.log("length after", await completedEvents.length)
      }

      console.log('completedEvents', campaign.completedEvents)
      const possibleEvents = events.filter(val => !completedEvents.includes(val))
      const evtId = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
      console.log("EVENT TO INSUE", evtId)

      
      createNewEvent = async () => {
        try {
          console.log('now building event')
          const newEvent = await Event.create({
            id: uuid.v4(),
            eventNumber: evtId,
            story: eventType,
            active: true,
            campaignId: campaign.id,
          })
          let json = await newEvent.toJson();
          eventObject = json;
          return json
        }
        catch(error) {
          console.log({ error: "Error creating new Event" })
        }
      }
      

      prepareMessages = async () => {
        let event = {
          players: [],
          data: {},
        }
        event.players = players;
        event.data = {
          eventType: eventType,
          eventNumber: evtId,
          eventId: eventObject.id,
          createdAt: eventObject.createdAt
        }
        console.log("=======================")
    
        if (eventType === 'story') {
          for (let player of players) {
            if (player.pushToken) {
              const message = {
                to: player.pushToken,
                sound: 'default',
                body: `You recieved a story event`,
                data: {
                  type: 'eventStart',
                  data: event
                }
              }
              messages.push(message)
            }
          }
        } else if (eventType === 'random') {
          for (let player of players) {
            if (player.pushToken) {
              const message = {
                to: player.pushToken,
                sound: 'default',
                body: `You recieved a random event`,
                data: {
                  type: 'eventStart',
                  data: event
                }
              }
              messages.push(message)
            }
          }
        }
      }

      await createNewEvent()
      await prepareMessages()
    }
  }

  if (messages.length !== 0) {
    console.log('-------------')
    console.log(await messages)
    console.log("DATA IN THE FIRST MESSAGE", await messages[0].data)
    console.log('-------------')
  
    await sendNotifications(messages)
  }
  
  process.exit(0)
}

randomEvent()
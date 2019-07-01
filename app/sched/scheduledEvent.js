if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const { getActiveCampaignsAtLocalTime, getAllActiveCampaigns, } = require('../util/getCampaigns')
const { sendNotifications } = require('../util/notifications')


async function randomEvent() {

  const campaigns = process.env.NODE_ENV == 'production'
    ? await getActiveCampaignsAtLocalTime(20)
    : await getAllActiveCampaigns()
  const messages = [];
  
  console.log('EVENT')
  console.log('==================')
  console.log('EVENT')

  for (let campaign of campaigns) {

    let players = await campaign.getPlayers()
    let eventType = null;
    //storyFreq will be based on the length of the campaign (story event occurs once every n days)
    campaign.length === '15' ? storyFreq = 3 : campaign.length === '30' ? storyFreq = 6 : storyFreq = 12;

    //Story events will start on the first full day of the campaign
    parseInt(campaign.currentDay)-1 % storyFreq ? eventType = 'random' : eventType = 'story';

    //Get all possible events
    

    // Build event object to display on Event screen in client
    let event = {
      players: [],
      data: {},
    }
    event.players = players;
    event.data = {
      eventType: eventType,
      antecedent: '',
      optionAButton: 'OptionA',
      optionAText: 'optionAText',
      optionBButton: 'OptionB',
      optionBText: 'optionBText',
    }

    console.log("in bulk", players)
    console.log("=======================")
    console.log("in bulk", campaign)

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
  console.log('-------------')
  console.log(messages)
  console.log('-------------')

  await sendNotifications(messages)

  process.exit(0)
}

randomEvent()
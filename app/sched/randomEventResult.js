if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { getAllActiveEvents, getEventVotes, } = require('../util/getEventsResults')
const { getSpecificCampaign } = require('../util/getCampaigns')
const { sendNotifications } = require('../util/notifications')



randomEventResult = async () => {
  const events = await getAllActiveEvents();
  const messages = [];

  for (let event of events) {
    let result = null;
    let campaign = await getSpecificCampaign(event.campaignId)
    let players = await campaign.getPlayers();
    console.log("PLAYERS IN EVENT================",players)
    const votes = await getEventVotes(event.id)

    console.log("full votes array", votes)

    let votesArr = votes.map(vote => vote.vote)
    let votesCount = votesArr.reduce((acc, curr) => {
      acc[curr] ? acc[curr]++ : acc[curr] = 1
      return acc
    }, {})
    console.log(votesCount)
    votesCount.A > votesCount.B ? result = 'A' : result = 'B'

    console.log("voting result", result)

    prepareMessages = async () => {
      let event = {
        players: [],
        data: {},
      }
      event.players = players;
      event.data = {
        
      }
      console.log("=======================")
  
      for (let player of players) {
        if (player.pushToken) {
          const message = {
            to: player.pushToken,
            sound: 'default',
            body: `Voting has ended!`,
            data: {
              type: 'eventResult',
              data: event
            }
          }
          messages.push(message)
        }
      }
    }
    prepareMessages()


  }

  console.log('-------------')
  console.log(messages)
  console.log("DATA IN THE FIRST MESSAGE", messages[0].data)
  console.log('-------------')

  await sendNotifications(messages)
  process.exit(0)
}


randomEventResult()
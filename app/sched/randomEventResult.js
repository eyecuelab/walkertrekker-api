if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const { getAllActiveEvents, getEventVotes, getPlayerVoteForEvent } = require('../util/getEventsResults')
const { getSpecificCampaign } = require('../util/getCampaigns')
const { sendNotifications } = require('../util/notifications')

const Event = sequelize.import('../models/event');
const Player = sequelize.import('../models/player');
const Vote = sequelize.import('../models/vote');


randomEventResult = async () => {
  const events = await getAllActiveEvents();
  const messages = [];

  for (let event of events) {
    let result = null;
    let playerVotes = {}
    const evtId = event.eventNumber;
    let campaign = await getSpecificCampaign(event.campaignId)
    let players = await campaign.getPlayers();
    const votes = await getEventVotes(event.id)

    for (let player of players) {
      let playerVote = await getPlayerVoteForEvent(event.id, player.id)
      let playerName = player.displayName
      console.log(playerName)
      playerVotes = { ...playerVotes, [playerName]: playerVote.vote }
      console.log("PLAYER VOTES OBJECT", playerVotes)
    }

    let votesArr = votes.map(vote => vote.vote)
    console.log("simple votes array", votesArr)

    // votesCount is object that has the count of all votes actually cast by players in the form { A:2, B:3 }
    let votesCount = votesArr.reduce((acc, curr) => {
      acc[curr] ? acc[curr]++ : acc[curr] = 1
      return acc
    }, {})
    console.log(votesCount)

    // if no votes were cast for A or for B, set that one to 0
    votesCount.A ? null : votesCount.A = 0
    votesCount.B ? null : votesCount.B = 0
    // if more votes were cast for A, result is A, otherwise it's B
    votesCount.A > votesCount.B ? result = 'A' : result = 'B'
    console.log("voting result", result)

    updateEvent = async () => {
      try {
        console.log('now updating event')
        updatedEvent = await event.update({
          active: false,
        })
        // let json = await updatedEvent.toJson();
        return updatedEvent.dataValues
      }
       catch(error) {
        console.log({ error: "Error updated Event" })
      }
    }

    prepareMessages = () => {
      let event = {
        players: [],
        data: {},
      }
      event.players = players;
      event.data = {
        result: result,
        eventId: evtId,
        playerVotes: playerVotes,
      }
      console.log("=======================")
  
      for (let player of players) {
        if (player.pushToken) {
          const message = {
            to: player.pushToken,
            sound: 'default',
            body: `Voting has ended!\nSee how your group voted.`,
            data: {
              type: 'eventResult',
              data: event
            }
          }
          messages.push(message)
        }
      }
    }
    await updateEvent()
    await prepareMessages()
  }

  console.log('-------------')
  console.log(messages)
  console.log("DATA IN THE FIRST MESSAGE", messages[0].data)
  console.log('-------------')

  await sendNotifications(messages)
  process.exit(0)
}


randomEventResult()
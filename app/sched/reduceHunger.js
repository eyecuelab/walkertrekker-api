if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { getActiveCampaignsAtLocalTime, getAllActiveCampaigns, } = require('./util/getCampaigns')
const { Expo } = require('expo-server-sdk')

async function reduceHunger() {
  const campaigns = await getAllActiveCampaigns()
  console.log('')
  console.log('==================')
  console.log('')
  for (let campaign of campaigns) {
    console.log(`Updating hunger for players in campaign ${campaign.id}`)
    let players = await campaign.getPlayers()
    for (let player of players) {
      const oldHunger = player.hunger
      const newHunger = oldHunger - 1
      console.log(`${player.displayName}'s hunger: ${oldHunger} ==> ${newHunger}`)
      await player.update({ hunger: newHunger })
      if (newHunger <= 0) {
        sendEndGameNotification(players, player)
      }
    }
    console.log('')
    console.log('==================')
    console.log('')
  }
  process.exit(0)
}

async function sendEndGameNotification(players, starvedPlayer) {
  const expo = new Expo()
  const messages = []
  for (let player of players) {
    if (player.pushToken) {
      const message = {
        to: player.pushToken,
        sound: 'default',
        body: `${starvedPlayer.displayName} has starved to death. Your campaign has come to an end.`,
        data: {
          type: 'endOfDayUpdate',
          data: {
            msg: `${starvedPlayer.displayName} starved to death.`
          }
        }
      }
      messages.push(message)
    }
  }
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('Notification sent.')
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.log('Error sending notification.')
      console.error(error);
    }
  }
}

reduceHunger()

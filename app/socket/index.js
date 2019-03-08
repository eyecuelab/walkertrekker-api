const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Player = sequelize.import('../models/player');
const Campaign = sequelize.import('../models/campaign');

const registerEventListenersOnConnect = (socket) => {
  console.log(`client connected, socket.id = ${socket.id}`)
  socket.on('log', (msg) => console.log(msg))
  socket.on('disconnect', () => console.log(`client disconnected, socket.id = ${socket.id}`))

  socket.on('connectToPlayer', async (playerId) => {
    try {
      console.log(`received connectToPlayer event, playerId ${playerId}`)
      let player = await Player.findOne({ where: { id: playerId } })
      if (player) {
        socket.join(playerId)
        socket.emit('log', `msg from server: connected to updates to player ${player.displayName}, id ${playerId}`)
      } else {
        socket.emit('log', `msg from server: no player found with id ${playerId}`)
      }
    }

    catch (err) {
      console.log('ERROR in socket.on connectToPlayer cb: ', err)
    }
  })

  socket.on('connectToCampaign', async (campaignId) => {
    try {
      console.log(`received connectoToCampaign event, campaignId ${campaignId}`)
      let campaign = await Campaign.findOne({ where: { id: campaignId } })
      if (campaign) {
        socket.join(campaignId)
        socket.emit('log', `msg from server: connected to updates to campaign, id ${campaignId}`)
      } else {
        socket.emit('log', `msg from server: no campaign found with id ${campaignId}`)
      }
    }

    catch (err) {
      console.log('ERROR in socket.on connectToCampaign cb: ', err)
    }
  })

}

function checkTime(timezone) {
  const now = new Date()
  const hour = now.getUTCHours()
  const min = now.getMinutes()
  let localHour = hour + timezone
  if (localHour < 0) { localHour = localHour + 24 }
  if (localHour > 24) { localHour = localHour - 24}
  return { localHour, min }
}

module.exports = {
  registerEventListenersOnConnect,
}

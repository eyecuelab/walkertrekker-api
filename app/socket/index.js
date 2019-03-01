const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Player = sequelize.import('../models/player');
const Campaign = sequelize.import('../models/campaign');

const registerEventListenersOnConnect = (socket) => {
  console.log(`client connected, socket.id = ${socket.id}`)
  socket.on('log', (msg) => console.log(msg))
  socket.on('disconnect', () => console.log(`client disconnected, socket.id = ${socket.id}`))

  socket.on('connectToPlayer', async (playerId) => {
    console.log(`received connectToPlayer event, playerId ${playerId}`)
    let player = await Player.findOne({ where: { id: playerId } })
    if (player) {
      socket.join(playerId)
      socket.emit('log', `msg from server: connected to updates to player ${playerId}`)
    } else {
      socket.emit('log', `msg from server: no player found with the specified playerId`)
    }
  })

  socket.on('connectToCampaign', async (campaignId) => {
    console.log(`received connectToCampaign event, campaignId ${campaignId}`)
    let campaign = await Campaign.findOne({ where: { id: campaignId } })
    if (campaign) {
      socket.join(campaignId)
      socket.emit('log', `msg from server: connected to updates to campaign ${campaignId}`)
    } else {
      socket.emit('log', `msg from server: no campaign found with the specified campaignId`)
    }
  })

  socket.on('endOfDayCampaignUpdate', () => console.log('recieved endOfDayCampaignUpdate event'))
}

module.exports = {
  registerEventListenersOnConnect,
}

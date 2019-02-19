
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Player = sequelize.import('../models/player');
const Campaign = sequelize.import('../models/campaign');

// io.on('connection', (socket) => {
//   console.log('client connected.')
//   socket.on('findPlayerInfo', async (playerId) => {
//     console.log('findPlayerInfo event received, executing callback')
//     console.log(`searching for player with id ${playerId}`)
//     let player = await Player.findOne({ where: { id: playerId } })
//     let response;
//     if (player) { response = await player.toJson() } else { response = false }
//     socket.emit('playerInfoFound', response)
//   })
//   socket.on('disconnect', () => console.log('client disconnected.'))
// });

const connectionCb = (socket) => {
  console.log('client connected')
  socket.on('findPlayerInfo', async (playerId) => {
    console.log(`findPlayerInfo event received, fetching data for player ${playerId}`)
    let player = await Player.findOne({ where: { id: playerId } })
    let response = await player.toJson()
    console.log(`Fetching data finished, result:`)
    console.log(response)
    console.log(`emitting playerInfoFound event`)
    socket.emit('playerInfoFound', response)
  })
  socket.on('findCampaignInfo', async (campaignId) => {
    socket.join(campaignId)
    console.log(`findCampaignInfo even received, fetching data for campaign ${campaignId}`)
    let campaign = await Campaign.findOne({ where: { id: campaignId } })
    let response = await campaign.toJson()
    console.log(`fetching data finished, result:`)
    console.log(response)
    console.log(`emitting campaignInfoFound event`)
    socket.emit('campaignInfoFound', response)
  })
  socket.on('disconnect', () => console.log('client disconnected'))
}

module.exports = {
  connectionCb,
}

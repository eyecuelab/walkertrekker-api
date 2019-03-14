const { sendNotifications } = require('../../util/notifications')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Campaign = sequelize.import('../../models/campaign')

const forceRandomEvent = async function() {
  const campaign = await Campaign.findOne({ where: { id: "9915d730-1c37-4602-af6b-c55c87510bc1" } })
  const players = await campaign.getPlayers()
  const campaignJson = await campaign.toJson()
  console.log('CAMPAIGN')
  console.log(campaignJson)
  let messages = []
  for (let player of campaignJson.players) {
    if (player.pushToken) {
      const message = {
        to: player.pushToken,
        sound: 'default',
        body: `Your group has reached a crossroads. Tap to decide how to deal with this latest crisis.`,
        data: {
          type: 'randomEventStart',
        }
      }
      messages.push(message)
    }
  }
  await sendNotifications(messages)
  process.exit(0)
}

forceRandomEvent()

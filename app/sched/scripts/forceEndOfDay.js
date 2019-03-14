const { sendNotifications } = require('../../util/notifications')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Campaign = sequelize.import('../../models/campaign')
const Player = sequelize.import('../../models/player')

const update = { players:
  [ { id: '8f97e71b-ffbc-4348-a350-789eaf3b335f',
  displayName: 'hi im joe',
  healthDiff: 7,
  stepsDiff: 5444 },
  { id: 'b9de95ec-730e-4d64-b2f7-ba7e19857e67',
  displayName: 'josh',
  healthDiff: 30,
  stepsDiff: -709 } ],
  inventoryDiff: { foodItems: 0, weaponItems: 0, medicineItems: 0 },
}

const forceEndOfDay = async function() {
  const campaign = await Campaign.findOne({ where: { id: "9915d730-1c37-4602-af6b-c55c87510bc1" } })
  const players = await campaign.getPlayers()
  let messages = []
  for (let player of update.players) {
    if (player.pushToken) {
      const message = {
        to: player.pushToken,
        sound: 'default',
        body: `Day ${campaign.currentDay + 1} has come to an end. Tap to see how your group fared today.`,
        data: {
          type: 'endOfDayUpdate',
          data: update
        }
      }
      messages.push(message)
    }
  }
  await sendNotifications(messages)
  process.exit(0)
}

forceEndOfDay()

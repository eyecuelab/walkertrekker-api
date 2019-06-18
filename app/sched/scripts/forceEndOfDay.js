const { sendNotifications } = require('../../util/notifications')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Campaign = sequelize.import('../../models/campaign')


const update = { players:
  [ { id: 'd88fc749-760d-43ee-a2e8-18614b87d9da',
  displayName: 'Kim',
  healthDiff: 7,
  stepsDiff: 5444 },
  { id: '6d567eb6-f2d5-48b4-9ad9-bb20171fa019',
  displayName: 'Digi',
  healthDiff: 30,
  stepsDiff: -709 } ],
  inventoryDiff: { foodItems: 0, weaponItems: 0, medicineItems: 0 },
}

const forceEndOfDay = async function() {
  const campaign = await Campaign.findOne({ where: { id: "d6e61e24-9cb2-42bc-b363-5ca00fa58078" } })
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
        body: `Day ${campaign.currentDay} has come to an end. Tap to see how your group fared today.`,
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

require('dotenv').config();
const { sendNotifications } = require('../../util/notifications')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Campaign = sequelize.import('../../models/campaign')



const update = { players:
  [ { id: 'ca7c667b-5ab8-4234-a384-31ddaedacec4',
  displayName: 'Agent DEeznuts',
  healthDiff: 0,
  stepsDiff: 0 },
  { id: '8810c4af-353f-40af-8682-8aa743f40c70',
  displayName: 'Too Chainz',
  healthDiff: 0,
  stepsDiff: 0 } ],
  inventoryDiff: { foodItems: 0, weaponItems: 0, medicineItems: 0 },
}

const forceEndOfDay = async function() {
  const campaign = await Campaign.findOne({ where: { id: "23449e1f-26c2-41ef-9a08-588d3afe2fc0" } }) // .then(res => console.log("response" + res)).catch(err => console.error("error" + err));
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

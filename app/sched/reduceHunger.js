if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { getActiveCampaignsAtLocalTime, getAllActiveCampaigns, } = require('../util/getCampaigns')
const campaignIsLost = require('../util/campaignIsLost')

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
        await campaignIsLost(campaign)
      }
    }
    console.log('')
    console.log('==================')
    console.log('')
  }
  process.exit(0)
}

reduceHunger()

const { getActiveCampaignsAtLocalTime, getAllActiveCampaigns, } = require('./util/getCampaigns')

async function reset() {
  const campaigns = await getAllActiveCampaigns()
  for (let campaign of campaigns) {
    let players = await campaign.getPlayers()
    for (let player of players) {
      player.health = 100
      for (let i = 1; i < player.stepTargets.length; i++) { player.stepTargets[i] = 0 }
      player.changed('stepTargets', true)
      await player.save()
    }
    campaign.currentDay = 0
    campaign.inventory.weaponItems = 2
    for (let i = 1; i < campaign.stepTargets.length; i++) { campaign.stepTargets[i] = 0 }
    campaign.changed('stepTargets', true)
    campaign.changed('inventory', true)
    await campaign.save()
  }
  process.exit(0)
}

reset()

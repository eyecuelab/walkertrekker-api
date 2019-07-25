const { sendNotifications } = require('./notifications');

async function campaignIsWon(campaign) {
  const finalCampaignState = await campaign.toSimpleJson()
  console.log("\nIN CAMPAING IS WON\n", finalCampaignState)
  const messages = []
  for (let player of finalCampaignState.players) {
    if (player.pushToken) {
      const message = {
        to: player.pushToken,
        body: `Congratulations, you and your friends have made it through the end of the Walker Trekker gauntlet. Tap here to see your final fate.`,
        sound: 'default',
        data: {
          type: 'campaignIsWon',
          data: { finalCampaignState },
        }
      }
      messages.push(message)
    }
  }
  await sendNotifications(messages)
  let players = await campaign.getPlayers()
  for (let player of players) {
    campaign.removePlayer(player)
    player.update({
      inActiveGame: false,
      health: null,
      hunger: null,
      steps: null,
      stepTargets: null,
      invited: []
    })
    player.save()
  }
}

module.exports = campaignIsWon

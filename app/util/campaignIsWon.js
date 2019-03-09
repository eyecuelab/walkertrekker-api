const { sendNotifications } = require('./notifications');

// STILL NEED TO TEST THIS TO SEE IF IT WORKS

async function campaignIsWon(campaign) {
  const finalCampaignState = await campaign.toJson()
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
  }
  campaign.destroy()
}

module.exports = campaignIsWon

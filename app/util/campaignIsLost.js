const { sendNotifications } = require('./notifications');

const campaignIsLost = async (campaign, updatedState) => {
  try {
    const finalCampaignState = await campaign.toJson()
    let players = finalCampaignState.players
    const starved = getStarvedPlayers(players)
    const beaten = getBeatenPlayers(players)
    let deadPlayers = []
    let causeOfDeath = ''
    let body = ''
    if (starved.length > 0) {
      causeOfDeath = 'starved'
      deadPlayers = starved
      body = `${deadPlayers[0].displayName} starved to death. Your Walker Trekker campaign is over. Tap to read the grisly details.`
    } else {
      causeOfDeath = 'beaten'
      deadPlayers = beaten
      body = `${deadPlayers[0].displayName} was attacked and killed. Your Walker Trekker campaign is over. Tap to see the grisly details.`
    }
    const messages = []
    const dataToSend = { type: 'campaignIsLost', data: { finalCampaignState, deadPlayers, causeOfDeath } }

    console.log('')
    console.log('  ==================  ')
    console.log('')
    console.log('  THIS CAMPAIGN HAS ENDED IN DEFEAT, SENDING THE FOLLOWING DATA TO PLAYERS VIA PUSH NOTIFICATION')
    console.log('')
    console.log(dataToSend)

    for (let player of finalCampaignState.players) {
      if (player.pushToken) {
        const message = {
          to: player.pushToken,
          body,
          sound: 'default',
          data: dataToSend,
        }
        messages.push(message)
      }
    }
    await sendNotifications(messages)

    console.log('Updating players and deleting campaign')
    const playerInstances = await campaign.getPlayers()
    for (let player of playerInstances) {
      console.log(player)
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
  catch (err) {
    console.log(err)
  }

}

function getStarvedPlayers(players) {
  const dead = []
  for (let player of players) {
    if (player.hunger < 0) {
      dead.push(player)
    }
  }
  return dead
}

function getBeatenPlayers(players) {
  const dead = []
  for (let player of players) {
    if (player.health < 0) {
      dead.push(player)
    }
  }
  return dead
}

module.exports = campaignIsLost

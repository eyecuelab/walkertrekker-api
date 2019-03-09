if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { getActiveCampaignsAtLocalTime, getAllActiveCampaigns, } = require('../util/getCampaigns')
const { sendNotifications } = require('../util/notifications')
const campaignIsLost = require('../util/campaignIsLost')
const campaignIsWon = require('../util/campaignIsWon')

async function endOfDayUpdate() {

  const campaigns = process.env.NODE_ENV == 'production'
    ? await getActiveCampaignsAtLocalTime(20)
    : await getAllActiveCampaigns()

  const updated = []
  const messages = []

  for (let campaign of campaigns) {
    // add id to array of campaign IDs being updated
    const id = campaign.id
    updated.push(id)

    // duplicate campaign state, then log before update
    let prevState = await campaign.toJson()
    const oldInventory = Object.assign({}, prevState.inventory)
    const oldStepTargets = [...prevState.stepTargets]
    console.log('')
    console.log('====================')
    console.log('')
    console.log(`Campaign ID: ${campaign.id}`)
    console.log(`Campaign state before update: `)
    console.log(prevState)
    console.log('')
    console.log('====================')
    console.log('')

    // get players in campaign, check to see if everyone hit their step target for the day
    let players = await campaign.getPlayers()
    const playersHitTargets = checkPlayerTargets(players, campaign)

    // assign damage
    if (!playersHitTargets) {
      [players, campaign] = resolveDamage(players, campaign)
    }

    // set next day's step targets
    [players, campaign] = setStepTargets(players, campaign, playersHitTargets)

    // roll over campaign.currentDay
    campaign = incrementCurrentDay(campaign)

    // save changes to database
    for (let player of players) {
      await player.save()
      let playerJson = player.toJson()
    }
    await campaign.save()

    // log campaign state after update
    let updatedState = await campaign.toJson()
    console.log('')
    console.log('====================')
    console.log('')
    console.log('Campaign state after update: ')
    console.log(updatedState)
    console.log('')
    console.log('====================')
    console.log('')

    // Check if game is over; if so, execute appropriate end game function, else send update
    const weLost = checkCampaignIsLost(players)
    const weWon = checkCampaignIsWon(campaign)
    console.log('WELOST: ', weLost)
    console.log('WEWON: ', weWon)
    if (weLost) {
      await campaignIsLost(campaign)
    }
    else if (weWon) {
      await campaignIsWon(campaign)
    }
    else {
      // Build update object to display on EndOfDaySummary screen in client
      let update = {
        players: [],
        inventoryDiff: {},
      }
      const prevDay = prevState.currentDay
      for (let player of prevState.players) {
        const prevPlayer = player
        const updatedPlayer = updatedState.players.filter(player => player.id === prevPlayer.id)[0]
        const playerInfo = {
          id: player.id,
          displayName: player.displayName,
          healthDiff: prevPlayer.health - updatedPlayer.health,
          stepsDiff: prevPlayer.steps[prevDay] - prevPlayer.stepTargets[prevDay]
        }
        update.players.push(playerInfo)
      }
      Object.keys(prevState.inventory).forEach(item => {
        update.inventoryDiff = Object.assign({}, update.inventoryDiff, {
          [item]: prevState.inventory[item].length - updatedState.inventory[item].length
        })
      })

      // log the update being sent out to players
      console.log(`Update data sent out to players: `)
      console.log(update)
      console.log('')
      console.log('====================')
      console.log('')

      // Construct push notifications
      for (let player of prevState.players) {
        if (player.pushToken) {
          const message = {
            to: player.pushToken,
            sound: 'default',
            body: `Day ${prevState.currentDay + 1} has come to an end. Tap to see how your group fared today.`,
            data: {
              type: 'endOfDayUpdate',
              data: update
            }
          }
          messages.push(message)
        }
      }

    }

  }

  // send push notifications
  await sendNotifications(messages)

  // final update log
  console.log(`${updated.length} campaigns updated: `)
  updated.forEach(id => console.log(id))

  process.exit(0)
}

function checkPlayerTargets(players, campaign) {
  let day = campaign.currentDay
  let out = true
  for (let player of players) {
    if (player.steps[day] < player.stepTargets[day]) {
      out = false
    }
  }
  return out
}

function resolveDamage(players, campaign) {
  const day = campaign.currentDay
  // determine damage based on difficulty
  const diff = campaign.difficultyLevel
  const DAMAGE_RANGES = {
    easy: [10, 20],
    hard: [15, 30],
    xtreme: [20, 40]
  }

  // deal randomized damage to players
  for (let player of players) {
    let damage = Math.floor( Math.random() * (DAMAGE_RANGES[diff][1] - DAMAGE_RANGES[diff][0] + 1) + DAMAGE_RANGES[diff][0] )
    if (player.steps[day] < player.stepTargets[day]) {
      // do 50% additional damage to players that failed to make their step target
      damage = Math.floor(damage * 1.5)
    } else if (campaign.inventory.weaponItems.length > 0) {
      // players that made their step target can use a weapon (if available) to reduce their damage by half
      campaign.inventory.weaponItems.shift()
      campaign.changed('inventory', true)
      damage = Math.floor(damage / 2)
    }
    player.health = player.health - damage
  }
  return [players, campaign]
}

function setStepTargets(players, campaign, playersHitTargets) {
  const today = campaign.currentDay
  const tomorrow = today + 1
  if (tomorrow == parseInt(campaign.length)) {
    return [players, campaign]
  }
  const diff = campaign.difficultyLevel
  const ADJUSTMENTS = {
    easy: 0.1,
    hard: 0.075,
    xtreme: 0.05
  }
  const adjustment = ADJUSTMENTS[diff]

  let groupTarget = playersHitTargets ? Math.floor(campaign.stepTargets[today] * (1 + adjustment)) : Math.floor(campaign.stepTargets[today] * (1 - adjustment))
  groupTarget = Math.max(groupTarget, 1000) // to prevent target from falling below a minimum threshold
  campaign.stepTargets[tomorrow] = groupTarget
  campaign.changed('stepTargets', true)

  const levels = [-500, -250, 0, 250, 500]
  for (let player of players) {
    // 1) based on group's target, adjust player's target up or down according to whether they hit today's target or not
    let playerTarget = player.steps[today] >= player.stepTargets[today] ? Math.floor(groupTarget * (1 + adjustment)) : Math.floor(groupTarget * (1 - adjustment))
    // 2) round player target to the nearest 250 steps
    let dec = (playerTarget/250) % 1
    playerTarget = dec < 0.5 ? 250 * Math.floor(playerTarget / 250) : 250 * Math.floor(playerTarget / 250)
    // 3) randomly move target up or down some multiple of 250 steps
    playerTarget = playerTarget + levels[Math.floor(Math.random()*levels.length)]
    player.stepTargets[tomorrow] = playerTarget
    player.changed('stepTargets', true)
  }
  return [players, campaign]
}

function incrementCurrentDay(campaign) {
  campaign.currentDay++
  return campaign
}

function checkCampaignIsLost(players) {
  for (let player of players) {
    if (player.health <= 0 || player.hunger <= 0) {
      return true
    }
  }
  return false
}

function checkCampaignIsWon(campaign) {
  const endDay = parseInt(campaign.length)
  const currentDay = campaign.currentDay
  if (currentDay >= endDay) {
    return true
  } else {
    return false
  }
}

endOfDayUpdate()

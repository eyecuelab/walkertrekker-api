const { getActiveCampaignsAtLocalTime, getAllActiveCampaigns, } = require('./util/getCampaigns')

async function endOfDayUpdate() {
  // get all active campaigns for which the local time is 8pm
  // const campaigns = await getActiveCampaignsAtLocalTime(20)
  const campaigns = await getAllActiveCampaigns()
  for (let campaign of campaigns) {
    let players = await campaign.getPlayers()
    // campaign = await incrementCurrentDay(campaign)
    console.log(campaign)
    console.log(players)
  }
  console.log(`${campaigns.length} campaigns updated`)
  process.exit(0)
}

async function incrementCurrentDay(campaign) {
  campaign.currentDay++
  campaign = await campaign.save()
  return campaign
}

endOfDayUpdate()

// WHAT TO DO AT THE END OF DAY
// vars:
//   campaign: Campaign / campaign instance
//   players: Player[] / array of player instances
//   groupSize: Int / campaign.numPlayers
//   groupStepTarget(n): Int / the group step target on day n
//   playerSteps(n): Int[] / number of steps each player made on day n, equal to player instance Player.steps[n]
//   playerStepTargets(n): Int[] / individual player step targets on day n
//   playersToMissTarget(n): Int, the number of players that missed their target (num such that playerSteps(n)[i] < playerStepTargets(n)[i])
//
// 1) increment currentDay
//   campaign.currentDay++
//
// 2) determine if players met step targets
//   for (let player of players)
//   // i) If yes (player.steps[n] > playerStepTargets(n)), resolve rewards for bonus steps
//   //   let rewards = Math.floor(player.steps[n] - playerStepTargets(n) / 250)
//   //     - get one reward for every 250 steps over personal step target. Could make this 1 reward for a % over the target, would prob be better
//   //     - randomize for now, can change later to specifically give a reward specified by player, though this will require more work
//   //   let inventory = [1,2,3]
//   //   let itemCategory = inventory[ Math.floor(Math.random() * inventory.length) ]
//   //   if itemCategory == 1 ==> campaign.inventory.foodItems++
//   //   else if itemCategory == 2 ==> campaign.inventory.medicineItems++
//   //   else ==> campaign.inventory.weaponItems++
//   i) If no, resolve damage to health of all players
//     if campaign.difficultyLevel == 'easy' ==> player.health = player.health - 15
//     else if campaign.difficultyLevel == 'hard' ==> player.health = player.health - 30
//     else if campaign.difficultyLevel == 'xtreme' ==> player.health = player.health - 40
//       - can randomize these if we want, might be better, e.g.: on easy, player loses something in range of (10, 20) health
//       - weapons?? consume 1 weapon automatically to prevent, say, 5 damage taken
//     if player.health < 0 ==> (((trigger end game)))
//
// 3) check if all players sent steps to server
//   i) If any player has steps = 0, do ... something (just end the game? maybe (((trigger end game))) ?)
//
// 4) calculate step targets for next day
//   ii) derive values
//     set group step target: tomorrow's group target should be 5% higher if everyone hit their targets, 5% lower if one person missed, 15% lower if two, etc.
//       groupStepTarget(n+1) = groupStepTarget(n)*(0.9) if at least one person missed
//     set individual step targets: player's target should be 110% of group step target if they made their target, 90% otherwise
//       for player[i], 0 <= i < groupSize
//         if playerSteps(n)[i] < playerStepTargets(n)[i] ==> playerStepTargets(n+1)[i] = groupStepTarget(n+1)*0.9
//         else ==> playerStepTargets(n+1)[i] = groupStepTarget(n+1)*1.1
//   iii) round to nearest 250 steps, then pseudo-randomize
//     for target in [groupStepTarget(n+1), ...playerStepTargets(n+1)]
//       let dec = (target/250) % 1
//         if dec < 0.5 ==> let roundedTarget = 250 * Math.floor(target / 250)
//         else ==> let roundedTarget = 250 * Math.ceil(target / 250)
//       let adjustments = [-500, -250, 0, 250, 500]
//       let adjustment = adjustments[Math.floor(Math.random()*adjustments.length)] / get one of adjustments at random
//       if roundedTarget + adjustment >= 1000 ==> target = roundedTarget + adjustment
//       else ==> target = 1000 / don't let any target get below this minimum threshold

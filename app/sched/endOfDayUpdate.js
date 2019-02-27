const getActiveCampaigns = require('./util/getActiveCampaignsAtLocalTime')

async function endOfDayUpdate() {
  const campaigns = await getActiveCampaignsAtLocalTime(20)
  console.log(campaigns)
  process.exit(0)
}

endOfDayUpdate()

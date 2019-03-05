// require('dotenv').config()

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Op = Sequelize.Op;
const Campaign = sequelize.import('../../models/campaign')

async function getActiveCampaignsAtLocalTime(timeTarget = 0) {
  // timeTarget: int from 0-23 (0: midnight, 23: 11pm)
  // what we want: given the specified target time, return all active campaigns for which the local time is equal to the target time at the time the function is called.
  // Example
  // we call getActiveCampaignsAtLocalTime(0) at 08:00 UTC, should return all active campaigns in timezone UTC-08:00
  const now = new Date()
  const hour = now.getUTCHours()
  let timezone = timeTarget - hour
  if (timezone < -12) { timezone = timezone + 24 }
  if (timezone > 12) { timezone = timezone - 24 }
  const campaigns = await Campaign.findAll({
    where: {
      startDate: {
        [Op.lte]: now
      },
      endDate: {
        [Op.gt]: now
      },
      timezone: timezone
    }
  })
  return campaigns
}

async function getAllActiveCampaigns() {
  const now = new Date()
  const campaigns = await Campaign.findAll({
    where: {
      startDate: {
        [Op.lte]: now
      },
      endDate: {
        [Op.gt]: now
      }
    }
  })
  return campaigns
}

module.exports = {
  getActiveCampaignsAtLocalTime,
  getAllActiveCampaigns,
}

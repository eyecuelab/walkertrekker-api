require('dotenv').config()

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Op = Sequelize.Op;
const Event = sequelize.import('../models/event')
const Vote = sequelize.import('../models/vote')

async function getAllActiveEvents() {
  // what we want: return all active events (those that were started 15 minutes ago)
  const event = await Event.findAll({
    where: {
      active: true,
    }  
  })
  return event
}

async function getEventVotes(eventId) {
  const votes = await Vote.findAll({
    where: {
      eventId: eventId,
    }
  })
  return votes
}

async function getPlayerVoteForEvent(eventId, playerId) {
  const playerVote = await Vote.findOne({
    where: {
      eventId: eventId,
      playerId: playerId
    }
  })
  return playerVote.dataValues
}



module.exports = {
  getAllActiveEvents,
  getEventVotes,
  getPlayerVoteForEvent,
};
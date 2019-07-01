
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Op = Sequelize.Op;
const Event = sequelize.import('../models/event')



async function getEvents(story) {

  const events = await Event.findAll({
    where: {
      storyEvent: story ? true : false
    }
  })
  console.log(events)
  return events;
}

module.exports = getEvents

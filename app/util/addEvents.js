
require('dotenv').config()
const events = require('./events/events')
const Sequelize = require(`sequelize`)
const sequelize = new Sequelize(process.env.DATABASE_URL)
const Event = sequelize.import(`../models/event`)
Event.sync()

const template = {
  antecedent: `antecedent`,
  optionAButton: `optionAButton`,
  optionAText: `optionAText`,
  optionAResult: {
    meds: 0,
    weapons: 0,
    food: 0,
    health: 0,
    stepTargets: 0
  },
  optionBButton: `optionBButton`,
  optionBText: `optionBText`,
  optionBResult: {},
}

async function addEvent(randomEvent) {
  try {
    const newEvent = await Event.create(randomEvent)
    const json = await newEvent.toJson()
    console.log('Event created')
    console.log(json)
  } catch (err) {
    console.log('ERROR ADDING NEW EVENT')
    console.log(err)
  }
}

async function eventLoop() {
  for (let evt of events) {
    await addEvent(evt)
  }
  process.exit(0)
}

eventLoop()

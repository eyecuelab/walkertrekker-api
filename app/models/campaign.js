if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const Twilio = require('twilio')
const client = Twilio(twilioAccountSid, twilioAuthToken)

function CampaignModel (sequelize, DataTypes) {
  const Player = sequelize.import('./player')

  const Campaign = sequelize.define('campaigns', {
    id: {
      type: DataTypes.UUID,
      notNull: true,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    currentDay: DataTypes.INTEGER,
    length: {
      type: DataTypes.ENUM,
      values: ['15', '30', '90']
    },
    difficultyLevel: {
      type: DataTypes.ENUM,
      values: ['easy', 'hard', 'xtreme']
    },
    randomEvents: {
      type: DataTypes.ENUM,
      values: ['low', 'mid', 'high']
    },
    numPlayers: DataTypes.INTEGER,
    stepTargets: DataTypes.ARRAY(DataTypes.INTEGER),
    inventory: DataTypes.JSONB,
    host: DataTypes.STRING,
    timezone: {
      type: DataTypes.INTEGER,
      validate: {
        min: -12,
        max: 12
      }
    },
    completedEvents: DataTypes.ARRAY(DataTypes.INTEGER)
  })

  Campaign.hasMany(Player)

  Campaign.prototype.toJson = async function() {
    let json = {
      id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      currentDay: this.currentDay,
      length: this.length,
      difficultyLevel: this.difficultyLevel,
      randomEvents: this.randomEvents,
      numPlayers: this.numPlayers,
      stepTargets: this.stepTargets,
      inventory: this.inventory,
      host: this.host,
      timezone: this.timezone,
      completedEvents: this.completedEvents,
      players: [],
    }

    let players = await this.getPlayers()
    if (players) {
      for (let player of players) {
        let playerData = player.toJson()
        json.players.push(playerData);
      }
    }
    return json
  }

  Campaign.prototype.sendInvite = function(player, number, link) {
    const msg = `${player.displayName} has invited you to join their Walker Trekker campaign. Tap here to join: ${link}`
    console.log(`--------------sending--------------`)
    console.log(`to: ${number}`)
    console.log(`message: ${msg}`)
    console.log(`-----------------------------------`)
    client.messages.create({
      body: msg,
      to: number,
      from: process.env.TWILIO_NUMBER
    }).then(message => console.log(`SMS message sent, sid: ${message.sid}`))
  }

  return Campaign;
}

module.exports = CampaignModel

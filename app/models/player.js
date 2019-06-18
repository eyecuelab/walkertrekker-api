const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const Twilio = require('twilio')
const client = Twilio(twilioAccountSid, twilioAuthToken)

function PlayerModel (sequelize, DataTypes) {

  const Player = sequelize.define('players', {
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
    displayName: DataTypes.STRING(30),
    phoneNumber: DataTypes.STRING(12),
    inActiveGame: DataTypes.BOOLEAN,
    health: DataTypes.INTEGER,
    hunger: DataTypes.INTEGER,
    steps: DataTypes.ARRAY(DataTypes.INTEGER),
    stepTargets: DataTypes.ARRAY(DataTypes.INTEGER),
    invited: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    avatar: DataTypes.STRING,
    pushToken: DataTypes.STRING,
  })

  Player.prototype.toJson = function() {
    let json = {
      id: this.id,
      displayName: this.displayName,
      phoneNumber: this.phoneNumber,
      inActiveGame: this.inActiveGame,
      campaignId: this.campaignId,
      health: this.health,
      hunger: this.hunger,
      steps: this.steps,
      stepTargets: this.stepTargets,
      invited: this.invited,
      avatar: this.avatar,
      pushToken: this.pushToken,
    }
    return json
  }

  Player.prototype.initCampaign = function(len) {
    let steps = [];
    let stepTargets = [];
    for (let i = 0; i < len; i++) {
      steps.push(0)
      stepTargets.push(0)
    }
    let json = {
      inActiveGame: true,
      health: 100,
      hunger: 100,
      steps,
      stepTargets
    }
    return json;
  }

  //player account recovery
  Player.prototype.getAccount = function(number, link) {
    const msg = `Click on the link to recover your account: ${link}`
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

  return Player
}

module.exports = PlayerModel

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN

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
  })

  Player.prototype.toJson = function * (opts = {}) {
    let json = {
      id: this.id,
      displayName: this.displayName,
      phoneNumber: this.phoneNumber,
      inActiveGame: this.inActiveGame,
      campaignId: this.campaignId,
      health: this.health,
      hunger: this.hunger,
      steps: this.steps,
    }
    return json
  }

  Player.prototype.sendInvite = function * (opts = {}) {

  }

  return Player
}

module.exports = PlayerModel

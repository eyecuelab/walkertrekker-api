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
  })

  Campaign.prototype.toJson = function * (opts = {}) {
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
      foodItems: this.inventory.foodItems,
      medicineItems: this.medicineItems,
      weaponItems: this.weaponItems,
    }

    let players = yield this.getPlayers()
    if (players) {
      json.players = players.map(player => { return player.toJson() })
    }
    return json
  }

  Campaign.hasMany(Player)
  return Campaign;
}

module.exports = CampaignModel

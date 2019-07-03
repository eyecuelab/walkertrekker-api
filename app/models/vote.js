if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


function VoteModel (sequelize, DataTypes) {

  const Vote = sequelize.define('votes', {
    id: {
      type: DataTypes.UUID,
      notNull: true,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
    },
    vote: {
      type: DataTypes.ENUM,
      values: ['A', 'B'],},
    eventId: {
      type: DataTypes.UUID,
    },
    playerId: {
      type: DataTypes.UUID,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Vote.associate = function(models) {
    Vote.belongsTo(models.Event)
    Vote.hasOne(models.Player)
  }

  Vote.prototype.toJson = function() {
    let json = {
      id: this.id,
      vote: this.vote,
      eventId: this.eventId,
      playerId: this.playerId,
    }
    return json
  }
  
  return Vote;
};

module.exports = VoteModel

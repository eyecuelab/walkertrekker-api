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
    playerVote: {
      type: DataTypes.ENUM,
      values: ['A', 'B'],},
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Vote.prototype.toJson = function() {
    let json = {
      id: this.id,
      eventId: this.eventId,
      playerId: this.playerId,
      active: this.active,
      story: this.story
    }
    return json
  }
  
  return Vote;
};

module.exports = VoteModel

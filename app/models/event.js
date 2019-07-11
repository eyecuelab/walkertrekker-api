if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


function EventModel (sequelize, DataTypes) {

  const Vote = sequelize.import('../models/vote')

  const Event = sequelize.define('events', {
    id: {
      type: DataTypes.UUID,
      notNull: true,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
    },
    eventNumber: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    story: {
      type: DataTypes.ENUM,
      values: ['story', 'random'],},
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    campaignId: {
      type: DataTypes.UUID,
    }
  });

  Event.hasMany(Vote)

  Event.prototype.toJson = async function() {
    let json = {
      id: this.id,
      campaignId: this.campaignId,
      eventNumber: this.eventNumber,
      active: this.active,
      story: this.story,
      votes: [],
      createdAt: this.createdAt,
    }

    let votes = await this.getVotes()
    if (votes) {
      for (let vote of votes) {
        let voteData = vote.toJson()
        json.votes.push(voteData);
      }
    }
    return json
  }

  return Event;
};

module.exports = EventModel

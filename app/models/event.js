if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


function EventModel (sequelize, DataTypes) {
  
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

  Event.associate = function(models) {
    Event.belongsTo(models.Campaign)
    Event.hasMany(models.Vote)
  }

  Event.prototype.toJson = function() {
    let json = {
      id: this.id,
      campaignId: this.campaignId,
      eventNumber: this.eventNumber,
      active: this.active,
      story: this.story
    }
    return json
  }

  return Event;
};

module.exports = EventModel

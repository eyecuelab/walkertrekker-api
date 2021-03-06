if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


function JournalModel (sequelize, DataTypes) {

  const Journal = sequelize.define('journals', {
    id: {
      type: DataTypes.UUID,
      notNull: true,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
    },
    entry: {
      type: DataTypes.TEXT,
    },
    entryDay: {
      type: DataTypes.INTEGER,
    },
    eventNumber: {
      type: DataTypes.INTEGER,
    },
    votingList: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    campaignId: {
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

  Journal.associate = function(models) {
    Journal.belongsTo(models.Campaign)
  }

  Journal.prototype.toJson = function() {
    let json = {
      id: this.id,
      entry: this.entry,
      eventNumber: this.eventNumber,
      entryDay: this.entryDay,
      campaignId: this.campaignId,
      votingList: this.votingList,
    }
    return json
  }
  
  return Journal;
};

module.exports = JournalModel

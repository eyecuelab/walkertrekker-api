
function EventModel (sequelize, DataTypes) {

  const Event = sequelize.define('events', {
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
    antecedent: DataTypes.STRING,
    optionAButton: DataTypes.STRING,
    optionAResult: DataTypes.ARRAY(DataTypes.STRING),
    optionAText: DataTypes.STRING,
    optionBButton: DataTypes.STRING,
    optionBResult: DataTypes.ARRAY(DataTypes.STRING),
    optionBText: DataTypes.STRING,
    optionALog: DataTypes.STRING,
    optionBLog: DataTypes.STRING,
    storyEvent: DataTypes.BOOLEAN
  }, {});


  Event.prototype.toJson = async function() {
    let json = {
      id: this.id,
      antecedent: this.antecedent,
      optionAButton: this.optionAButton,
      optionAResult: this.optionAResult,
      optionAText: this.optionAText,
      optionBButton: this.optionBButton,
      optionBResult: this.optionBResult,
      optionBText: this.optionBText,
      optionALog: this.optionALog,
      optionBLog: this.optionBLog,
      storyEvent: this.storyEvent
    }
    return json
  }

  return Event;
};

module.exports = EventModel
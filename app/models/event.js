
function EventModel (sequelize, DataTypes) {

  const Event = sequelize.define('Event', {
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
  

  return Event;
};

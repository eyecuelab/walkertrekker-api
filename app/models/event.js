require('dotenv').config()

function EventModel (sequelize, DataTypes) {

  const Event = sequelize.define('events', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    antecedent: DataTypes.STRING,
    optionAButton: DataTypes.STRING,
    optionAText: DataTypes.STRING,
    optionAResult: DataTypes.JSON,
    optionBButton: DataTypes.STRING,
    optionBText: DataTypes.STRING,
    optionBResult: DataTypes.JSON,
  })

  Event.prototype.toJson = function() {
    let json = {
      id: this.id,
      antecedent: this.antecedent,
      optionAButton: this.optionAButton,
      optionAText: this.optionAText,
      optionAResult: this.optionAResult,
      optionBButton: this.optionBButton,
      optionBText: this.optionBText,
      optionBResult: this.optionBResult,
    }
    return json
  }

  Event.prototype.prompt = function() {
    let json = {
      id: this.id,
      antecedent: this.antecedent,
      optionAButton: this.optionAButton,
      optionBButton: this.optionBButton,
    }
    return json
  }

  Event.prototype.optionA = function() {
    let json = {
      button: this.optionAButton,
      text: this.optionAText,
      result: this.optionAResult
    }
    return json
  }

  Event.prototype.optionB = function() {
    let json = {
      button: this.optionBButton,
      text: this.optionBText,
      result: this.optionBResult
    }
    return json
  }

  return Event;
}

module.exports = EventModel

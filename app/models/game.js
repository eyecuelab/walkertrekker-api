const bcrypt = require('bcrypt-nodejs')

function GameModel (sequelize, DataTypes) {
  const User = sequelize.import('./user')

  const Game = sequelize.define('games', {
    accessToken: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    opponentId: DataTypes.INTEGER,
    data: DataTypes.JSONB
  }, {
    classMethods: {},
    instanceMethods: {
      toJson: toJson
    }
  })

  function * toJson (opts = {}) {
    let json = {
      id: this.id,
      accessToken: this.accessToken,
      boards: this.data.boards,
      manaItems: this.data.manaItems,
      goldItems: this.data.goldItems
    }

    let user = yield this.getUser()
    if (user) json.player1 = yield user.toJson()

    let opponent = yield this.getOpponent()
    if (opponent) json.player2 = yield opponent.toJson()

    return json
  }

  Game.belongsTo(User)
  Game.belongsTo(User, { as: 'opponent', foreignKey: 'opponentId' })

  return Game
}

module.exports = GameModel

function InviteModel (sequelize, DataTypes) {
  const Campaign = sequelize.import('./campaign')

  const Invite = sequelize.define('invites', {
    senderPhone: DataTypes.STRING,
    senderName: DataTypes.STRING,
    receiverPhone: DataTypes.STRING,
    sent: DataTypes.BOOLEAN,
    sentAt: DataTypes.DATE,
    accepted: DataTypes.BOOLEAN,
    declined: DataTypes.BOOLEAN,
    campaignId: INTEGER
  }, {
    classMethods: {},
    instanceMethods: {
      sendInvite: sendInvite
    }
  })

  function sendInvite() {
    // bring in twilioClient, send message with a deeplink to walkertrekker app where user can accept or decline invitation
  }

  Invite.belongsTo(Campaign)
}

module.exports = InviteModel

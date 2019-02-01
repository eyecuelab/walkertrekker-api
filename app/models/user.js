const bcrypt = require('bcrypt-nodejs')

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const Twilio = require('twilio')
const twilioClient = Twilio(twilioAccountSid, twilioAuthToken)
const LookupsClient = Twilio.LookupsClient
const lookupsClient = new LookupsClient(twilioAccountSid, twilioAuthToken)

function UserModel (sequelize, DataTypes) {
  const User = sequelize.define('users', {
    username: DataTypes.STRING,
    phone: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN,
    authToken: DataTypes.STRING,
    authTokenExpiresAt: DataTypes.DATE,
    code: DataTypes.STRING,
    email: DataTypes.STRING,
    info: DataTypes.JSONB
  }, {
    classMethods: {
      generateHash: generateHash,
      twilioPhoneLookup: twilioPhoneLookup
    },
    instanceMethods: {
      validPassword: validPassword,
      toJson: toJson,
      sendVerifyCode: sendVerifyCode
    }
  })

  function generateHash (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
  }

  function twilioPhoneLookup (phone, cb) {
    lookupsClient.phoneNumbers(phone).get(cb)
  }

  function generateVerifyCode () {
    return Math.floor(Math.random() * 90000) + 10000
  }

  function validPassword (password) {
    return bcrypt.compareSync(password, this.password)
  }

  function * toJson (opts = {}) {
    let json = {
      id: this.id,
      username: this.username,
      phone: this.phone,
      imageUrl: this.imageUrl,
      confirmed: this.confirmed,
      email: this.email,
      info: this.info
    }

    return json
  }

  function sendVerifyCode (cb) {
    this.code = generateVerifyCode()
    this.save().then(function () {
      let message = `Tap here to sign into Walkertrekker: walkertrekker://${this.code}`
      console.log('-----------sending to', this.phone, message)
      twilioClient.sendMessage({
        to: this.phone,
        from: process.env.TWILIO_NUMBER,
        body: message
      }, function (err, data) {
        if (err) cb(err)

        cb()
      })
    }).catch(cb)
  }

  // User.belongsToMany(Event, { through: EventInvite })
  // User.hasMany(EventInvite)
  // EventInvite.belongsTo(User)
  // EventInvite.belongsTo(Event)
  // Event.belongsToMany(User, { through: EventInvite })
  // Event.hasMany(EventInvite)
  // EventCategoryItem.belongsTo(User)
  // User.hasMany(EventCategoryItem)

  return User
}

module.exports = UserModel

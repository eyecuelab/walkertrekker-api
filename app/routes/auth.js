const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const User = sequelize.import('../models/user')
const { normalizePhoneNumber } = require('../middlewares')

function authRouter (app, passport) {
  /**
   * @api {post} /api/verify Verify phone number
   * @apiName PostVerifyPhone
   * @apiGroup Auth
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -d '{"phone":"1231231234"}' http://localhost:5000/api/verify
   *
   * @apiParam {String} phone Phone number.
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {}
   */
  app.post('/api/verify', normalizePhoneNumber, function (req, res) {
    User.findOrCreate({ where: { phone: req.body.phone } }).spread(function (user, created) {
      user.sendVerifyCode(function (err) {
        if (err) return res.json({ error: 'Could not send sms' })

        return co(function * () {
          let json = yield user.toJson()

          return res.json(json)
        })
      })
    })
  })

  /**
   * @api {post} /api/login Login with code
   * @apiName PostLogin
   * @apiGroup Auth
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -d '{"code":"12345"}' http://localhost:5000/api/login
   *
   * @apiSuccess {String} auth_token Access token
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "auth_token": "dc16a136b95d24267606dc9cf297ce756199f96b"
   *   }
   */
  app.post('/api/login', function (req, res) {
    User.findOne({ where: { code: req.body.code } }).then(function (user) {
      user.code = null
      user.authToken = uuid.v1()
      user.confirmed = true

      return user.save().then(function () {
        return res.json({ auth_token: user.authToken })
      }).catch(function (err) {
        console.log(err)
        return res.json({ error: 'Error saving user data' })
      })
    }).catch(function (err) {
      console.log(err)
      return res.json({ error: 'Invalid code' })
    })
  })
}

module.exports = authRouter

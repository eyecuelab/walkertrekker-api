// var LocalStrategy = require('passport-local').Strategy

var Sequelize = require('sequelize')
var sequelize = new Sequelize(process.env.DATABASE_URL)

var User = sequelize.import('../app/models/user')
// User.sync()

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
      done(null, user)
    }).catch(function (err) {
      done(err, false)
    })
  })

  // passport.use('local-login', new LocalStrategy({
  //   usernameField: 'phone',
  //   passwordField: 'password',
  //   passReqToCallback: true
  // },
  // function (req, phone, password, done) {
  //   User.findOne({ where: { phone: phone } })
  //   .then(function (user) {
  //     if (!user) {
  //       done(null, false, req.flash('loginMessage', 'Unknown user'))
  //     } else if (!user.validPassword(password)) {
  //       done(null, false, req.flash('loginMessage', 'Wrong password'))
  //     } else {
  //       done(null, user)
  //     }
  //   })
  //   .catch(function (e) {
  //     done(null, false, req.flash('loginMessage', e.name + ' ' + e.message))
  //   })
  // }))
  //
  // passport.use('local-signup', new LocalStrategy({
  //   firstnameField: 'firstName',
  //   lastnameField: 'lastName',
  //   usernameField: 'email',
  //   phoneField: 'phone',
  //   imageField: 'image',
  //   passwordField: 'password',
  //   passReqToCallback: true
  // },
  // function (req, res, done) {
  //   User.findOne({ where: { phone: req.body.phone } })
  //     .then(function (existingUser) {
  //       if (existingUser) {
  //         return done(null, false, req.flash('loginMessage', 'The phone number is already being used.'))
  //       }
  //
  //       if (req.user) {
  //         var user = req.user
  //         user.firstName = req.body.firstName
  //         user.lastName = req.body.lastName
  //         user.phone = req.body.phone
  //         user.email = req.body.email
  //         user.image = req.body.image
  //         user.password = User.generateHash(req.body.password)
  //         user.save().catch(function (err) {
  //           throw err
  //         }).then(function () {
  //           done(null, user)
  //         })
  //       } else {
  //         var newUser = User.build({ phone: req.body.phone,
  //                                    password: User.generateHash(req.body.password)})
  //         newUser.save().then(function () {
  //           done(null, newUser)
  //         }).catch(function (err) {
  //           done(null, false, req.flash('loginMessage', err))
  //         })
  //       }
  //     })
  //     .catch(function (e) {
  //       done(null, false, req.flash('loginMessage', e.name + ' ' + e.message))
  //     })
  // }))
}

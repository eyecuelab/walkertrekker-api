const resources = [ 'auth', 'users', 'games', 'players', ]

function router (app, passport) {
  app.get('/', function (req, res) {
    res.render('index.ejs')
  })

  app.get('/promo', function (req, res) {
    res.render('promo.ejs')
  })

  for (let resource of resources) {
    require(`./${resource}`)(app, passport)
  }
}

module.exports = router

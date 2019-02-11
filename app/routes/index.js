const resources = [ 'players', 'campaigns' ]

function router (app) {
  app.get('/', function (req, res) {
    res.render('index.ejs')
  })

  app.get('/promo', function (req, res) {
    res.render('promo.ejs')
  })

  for (let resource of resources) {
    require(`./${resource}`)(app)
  }
}

module.exports = router

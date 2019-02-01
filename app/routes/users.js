const co = require('co')
const { loginRequired } = require('../middlewares')

function usersRouter (app) {
  /**
   * @api {get} /api/profile User profile
   * @apiName GetProfile
   * @apiGroup Profile
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" http://localhost:5000/api/profile
   *
   * @apiSuccess {Integer} id User id
   * @apiSuccess {String} username First name
   * @apiSuccess {String} phone Phone number
   * @apiSuccess {String} imageUrl Image url
   * @apiSuccess {Object} info Info
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "id": 123,
   *     "username": "Bob",
   *     "phone": "+1231231234",
   *     "imageUrl": "http://example.com/image.jpg",
   *     "info": {}
   *   }
   */
  app.get('/api/profile', loginRequired, function (req, res) {
    co(function * () {
      let json = yield req.user.toJson({ extras: true })

      return res.json(json)
    })
  })

  /**
   * @api {patch} /api/profile Update user profile
   * @apiName PatchProfile
   * @apiGroup Profile
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" -d '{"username":"Jim", "email": "email@example.com", "imageUrl":"http://test.com.a.jpg", "info": "{'something': 'value'}"}' http://localhost:5000/api/profile
   *
   * @apiSuccess {Integer} id User id
   * @apiSuccess {String} username First name
   * @apiSuccess {String} phone Phone number
   * @apiSuccess {String} imageUrl Image url
   * @apiSuccess {Object} info Info
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "id": 123,
   *     "username": "Bob",
   *     "phone": "+1231231234",
   *     "info": {},
   *     "imageUrl": "http://example.com/image.jpg"
   *   }
   */
  app.patch('/api/profile', loginRequired, function (req, res) {
    co(function * () {
      let inputs = ['username', 'imageUrl', 'email', 'info']
      for (let input of inputs) {
        if (req.body[input]) req.user[input] = req.body[input]
      }
      yield req.user.save()
      let json = yield req.user.toJson()

      return res.json(json)
    }).catch(function (err) {
      console.log(err)
      res.json({ error: 'Error updating user data' })
    })
  })

  /**
   * @api {delete} /api/profile Delete
   * @apiName DeleteProfile
   * @apiGroup Profile
   *
   * @apiExample {curl} Example usage:
   *   curl -X DELETE -H "Content-type: application/json" -H "appkey: abc" -H "auth_token: abc" http://localhost:5000/api/profile
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {}
   */
  app.delete('/api/profile',
    loginRequired,
    function (req, res) {
      req.user.destroy().then(function () {
        return res.json({})
      }).catch(function (err) {
        console.log(err)
        return res.json({ error: 'Error deleting event category' })
      })
    }
  )
}

module.exports = usersRouter

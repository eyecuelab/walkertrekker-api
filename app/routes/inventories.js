const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchInventory } = require('../middlewares');
const Inventory = sequelize.import('../models/inventory');


function inventoriesRouter(app) {

  /**
   * @api {get} /api/inventories/:inventoryId Fetch Inventory
   * @apiName Fetch Inventory
   * @apiGroup Inventories
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/inventories/:inventoryId
   *
   * @apiSuccess {String} id Inventory UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {String} itemType Either 'weapon', 'med', or 'food'
   * @apiSuccess {Integer} itemNumber Number to display to front-end
   * @apiSuccess {String} source Either 'player' or 'event'
   * @apiSuccess {String} sourceId UUID of player, if player added this item
   * @apiSuccess {String} user Either 'player' or 'event'
   * @apiSuccess {String} userId UUID of player, if player used this item
   * @apiSuccess {Boolean} used True if the item has been consumed
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "itemType": "weapon",
   *    "itemNumber": 4,
   *    "source": "player",
   *    "sourceId": "b1d77784-742b-4129-9952-d6b6c0f469c4",
   *    "user": "player",
   *    "userId": "b1d77784-742b-4129-9952-d6b6c0f469c4",
   *    "used": true
   *  }
  */
  app.get('/api/inventories/:inventoryId', appKeyCheck, fetchInventory, function(req, res) {
    co(function * () {
        if (req.inventory == 'No inventory found') {
          return res.json({ error: 'No inventory found with specified inventoryId'})
        }
        let json = yield req.inventory.toJson();
        return res.json(json)
      }).catch(function (err) {
        console.log(err)
      res.json({ error: 'Error fetching inventory' })
      })
    }
  )

  /**
   * @api {post} /api/inventories/:campaignId Create Inventory
   * @apiName Create Inventory
   * @apiGroup Inventories
   *
   * @apiExample {curl} Example usage:
   *   curl -X POST -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/inventories/:campaignId
   *
   * @apiSuccess {String} id Inventory UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {String} itemType Either 'weapon', 'med', or 'food'
   * @apiSuccess {Integer} itemNumber Number to display to front-end
   * @apiSuccess {String} source Either 'player' or 'event'
   * @apiSuccess {String} sourceId UUID of player, if player added this item
   * @apiSuccess {String} user Either 'player' or 'event'
   * @apiSuccess {String} userId UUID of player, if player used this item
   * @apiSuccess {Boolean} used True if the item has been consumed
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "itemType": "weapon",
   *    "itemNumber": 4,
   *    "source": "player",
   *    "sourceId": "b1d77784-742b-4129-9952-d6b6c0f469c4",
   *    "user": "player",
   *    "userId": "b1d77784-742b-4129-9952-d6b6c0f469c4",
   *    "used": true
   *  }
  */
  app.post('/api/inventories/:campaignId', appKeyCheck, function(req, res){
    co(async function() {
      console.log('now building inventory')
      const newInventory = await Inventory.create({
        id: uuid.v4(),
        itemType: req.body.itemType,
        itemNumber: req.body.itemNumber,
        source: req.body.source,
        sourceId: req.body.sourceId,
        user: req.body.user,
        userId: req.body.userId,
        used: req.body.used,
        campaignId: req.params.campaignId,
      })
      newInventory.save()
      let json = newInventory.toJson();
      return res.json(json)
    }).then(function (result) {
      return result.dataValues
    }).catch((error) => {
      return res.json({ error: "Error creating new Inventory:", error })
    })
  })

  /**
   * @api {patch} /api/inventories/:inventoryId Update Inventory
   * @apiName Update Inventory
   * @apiGroup Inventories
   *
   * @apiExample {curl} Example usage:
   *   curl -X PATCH -H "Content-type: application/json" -H "appkey: abc" -H  http://walkertrekker.herokuapp.com/api/inventories/:inventoryId
   *
   * @apiSuccess {String} id Inventory UUID
   * @apiSuccess {String} campaignId UUID of current game
   * @apiSuccess {String} itemType Either 'weapon', 'med', or 'food'
   * @apiSuccess {Integer} itemNumber Number to display to front-end
   * @apiSuccess {String} source Either 'player' or 'event'
   * @apiSuccess {String} sourceId UUID of player, if player added this item
   * @apiSuccess {String} user Either 'player' or 'event'
   * @apiSuccess {String} userId UUID of player, if player used this item
   * @apiSuccess {Boolean} used True if the item has been consumed
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *    "id": "feef135f-256a-48de-a9c5-5ae48be55329",
   *    "campaignId": "9d5adb58-6939-4f0a-915f-0fcd1c6bfa75",
   *    "itemType": "weapon",
   *    "itemNumber": 4,
   *    "source": "player",
   *    "sourceId": "b1d77784-742b-4129-9952-d6b6c0f469c4",
   *    "user": "player",
   *    "userId": "b1d77784-742b-4129-9952-d6b6c0f469c4",
   *    "used": true
   *  }
  */
  app.patch('/api/inventories/:inventoryId', appKeyCheck, fetchInventory, function(req, res) {
    co(async function() {
      if (req.inventory == 'No inventory found') {
        return res.json({ error: 'No inventory found with specified inventoryId'})
      }
      let inventory = req.inventory
      await inventory.update(req.body.inventoryUpdate)
      let json = await inventory.toJson()
      return res.json(json)
    })
  })

}

module.exports = inventoriesRouter
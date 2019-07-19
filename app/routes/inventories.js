const co = require('co')
const uuid = require('node-uuid')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const { appKeyCheck, fetchInventory } = require('../middlewares');
const Inventory = sequelize.import('../models/inventory');


function inventoriesRouter(app) {

  app.get('/api/inventories/:inventoryId', appKeyCheck, fetchInventory, function(req, res) {
    co(function * () {
        if (req.inventory == null) {
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

  app.post('/api/inventories/:campaignId', appKeyCheck, function(req, res){
    co(async function() {
      console.log('now building inventory')
      const newInventory = await Inventory.create({
        id: uuid.v4(),
        itemType: req.body.itemType,
        itemNumber: req.body.itemNumber,
        addedBy: req.body.addedBy,
        addedById: req.body.addedById,
        usedBy: req.body.usedBy,
        usedById: req.body.usedById,
        used: req.body.used,
        campaignId: req.params.campaignId,
      })
      newInventory.save()
      let json = newInventory.toJson();
      return res.json(json)
    }).then(function (result) {
      console.log("result", result.req.body)
      console.log("type of", typeof result);
      return result.dataValues
    }).catch((error) => {
      return res.json({ error: "Error creating new Inventory:", error })
    })
  })

  // app.patch()


}

module.exports = inventoriesRouter
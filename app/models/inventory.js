if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}



function InventoryModel (sequelize, DataTypes) {

  const Inventory = sequelize.define('inventories', {
    id: {
      type: DataTypes.UUID,
      notNull: true,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.UUID,
    },
    itemType: { 
      type: DataTypes.ENUM,
      values: ['food', 'med', 'weapon'],
    },
    itemNumber: { 
      type: DataTypes.INTEGER 
    },
    addedBy: { 
      type: DataTypes.ENUM,
      values: ['player', 'event'],
    },
    addedById: { 
      type: DataTypes.UUID 
    },
    usedBy: { 
      type: DataTypes.ENUM,
      values: ['player', 'event'],
    },
    usedById: { 
      type: DataTypes.UUID 
    },
    used: { 
      type: DataTypes.BOOLEAN 
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  })

  Inventory.associate = function(models) {
    Inventory.belongsTo(models.Campaign)
  }

  Inventory.prototype.toJson = function() {
    let json = {
      id: this.id,
      campaignId: this.campaignId,
      itemType: this.itemType,
      itemNumber: this.itemNumber,
      addedBy: this.addedBy,
      addedById: this.addedById,
      usedBy: this.usedBy,
      usedById: this.usedById,
      used: this.used,
    }
    return json;
  }

  return Inventory;
}

module.exports = InventoryModel
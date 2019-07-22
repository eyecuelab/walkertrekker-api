exports.up = function(pgm) {
  pgm.createTable('inventories', {
    id: {
      type: 'string',
      primaryKey: true,
      notNull: true,
    },
    campaignId: { type: 'string' },
    itemType: { type: 'itemtype' },
    itemNumber: { type: 'integer' },
    addedBy: { type: 'usertype'},
    addedById: { type: 'string' },
    usedBy: { type: 'userType'},
    usedById: { type: 'string' },
    used: { type: 'boolean' },
    createdAt: {
      type: 'datetime',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updatedAt: {
      type: 'datetime',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
};

exports.down = function(pgm) {
  pgm.dropTable('inventories')
};

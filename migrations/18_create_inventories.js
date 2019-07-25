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
    source: { type: 'usertype'},
    sourceId: { type: 'string' },
    user: { type: 'userType'},
    userId: { type: 'string' },
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

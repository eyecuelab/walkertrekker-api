exports.up = function(pgm) {
  pgm.createTable('journals', {
    id: {
      type: 'string',
      primaryKey: true,
      notNull: true,
    },
    playerId: { type: 'string' },
    campaignId: {type: 'string'},
    entry: { type: 'text' },
    entryDay: { type: 'integer' },
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
  pgm.dropTable('journals')
};

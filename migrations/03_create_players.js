exports.up = function(pgm) {
  pgm.createTable('players', {
    id: {
      type: 'string',
      primaryKey: true,
      notNull: true,
    },
    createdAt: {
      type: 'datetime',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updatedAt: {
      type: 'datetime',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    displayName: { type: 'string', length: 30 },
    phoneNumber: { type: 'string', length: 12 },
    inActiveGame: { type: 'boolean' },
    health: { type: 'integer' },
    hunger: { type: 'integer' },
    steps: { type: 'integer[]' },
    campaignId: { type: 'string' },
  })
};

exports.down = function(pgm) {
  pgm.dropTable('players');
};

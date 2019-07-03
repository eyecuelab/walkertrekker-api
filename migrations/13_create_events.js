exports.up = function(pgm) {
  pgm.createTable('events', {
    id: {
      type: 'string',
      primaryKey: true,
      notNull: true,
    },
    campaignId: { type: 'string' },
    eventNumber: { type: 'integer' },
    active: { type: 'boolean' },
    story: { type: 'eventClass' },
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
  });
};

exports.down = function(pgm) {
  pgm.dropTable('events');
};

exports.up = function(pgm) {
  pgm.createTable('votes', {
    id: {
      type: 'string',
      primaryKey: true,
      notNull: true,
    },
    eventId: { type: 'string' },
    playerId: { type: 'string' },
    vote: { type: 'voteType' },
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
  pgm.dropTable('votes');
};

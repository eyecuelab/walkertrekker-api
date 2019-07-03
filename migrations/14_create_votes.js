exports.up = function(pgm) {
  pgm.createTable('votes', {
    id: {
      type: 'string',
      primaryKey: true,
      notNull: true,
    },
    eventId: { type: 'string' },
    playerId: { type: 'string' },
    vote: { type: 'voteType' }
  })
};

exports.down = function(pgm) {
  pgm.dropTable('votes');
};

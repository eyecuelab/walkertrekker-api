exports.up = function(pgm) {
  pgm.createTable('games', { id: { type: 'serial', primaryKey: true },
                             userId: { type: 'integer' },
                             opponentId: { type: 'integer' },
                             data: { type: 'jsonb' },
                             accessToken: { type: 'string' },
                             createdAt: { type: 'datetime' },
                             updatedAt: { type: 'datetime' }})
};

exports.down = function(pgm) {
  pgm.dropTable('games')
};

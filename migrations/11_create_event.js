
exports.up = function(pgm) {
  pgm.createTable('events', {
    id: {
      type: 'string',
      primaryKey: true,
      notNull: true,
    },
    antecedent: { type: 'string' },
    optionAButton: { type: 'string' },
    optionAResult: { type: 'text ARRAY' },
    optionAText: { type: 'string' },
    optionBButton: { type: 'string' },
    optionBResult: { type: 'text ARRAY' },
    optionBText: { type: 'string' },
    optionALog: { type: 'string' },
    optionBLog: { type: 'string' },
    storyEvent: { type: 'boolean' },
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
}

exports.down = function(pgm) {
  pgm.dropTable('events');
};
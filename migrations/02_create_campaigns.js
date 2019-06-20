exports.up = function(pgm) {
  pgm.createTable('campaigns', {
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
    startDate: { type: 'date' },
    endDate: { type: 'date' },
    currentDay: { type: 'integer' },
    length: { type: 'campaignlength' },
    difficultyLevel: { type: 'difficultylevel' },
    randomEvents: { type: 'randomevents' },
    numPlayers: { type: 'integer' },
    stepTargets: { type: 'integer[]' },
    inventory: { type: 'jsonb' },
  })
};

exports.down = function(pgm) {
  pgm.dropTable('campaigns');
};

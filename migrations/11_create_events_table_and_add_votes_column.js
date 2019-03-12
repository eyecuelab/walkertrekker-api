exports.up = function(pgm) {
  pgm.createTable('events', {
    id: 'id',
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
    antecedent: { type: 'string' },
    optionAButton: { type: 'string' },
    optionAText: { type: 'string' },
    optionAResult: { type: 'json' },
    optionBButton: { type: 'string' },
    optionBText: { type: 'string' },
    optionBResult: { type: 'json' },
  })

  pgm.addColumns('campaigns', {
    votes: { type: 'integer[]' }
  })
}

exports.down = function(pgm) {
  pgm.dropTable('events')
  pgm.dropColumns('campaigns', [ 'votes' ])
}

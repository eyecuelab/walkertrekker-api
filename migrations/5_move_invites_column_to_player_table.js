exports.up = function(pgm) {
  pgm.addColumns('players', {
    invited: { type: 'text ARRAY' },
  })

  pgm.dropColumns('campaigns', [ 'invited' ])
};

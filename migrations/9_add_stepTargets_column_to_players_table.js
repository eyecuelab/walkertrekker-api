exports.up = function(pgm) {
  pgm.addColumns('players', {
    stepTargets: { type: 'integer[]' },
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('players', [ 'stepTargets' ]);
};

exports.up = function(pgm) {
  pgm.addColumns('players', {
    pushToken: { type: 'text' },
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('players', [ 'pushToken' ]);
};

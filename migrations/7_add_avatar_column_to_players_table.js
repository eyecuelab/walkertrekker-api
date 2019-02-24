exports.up = function(pgm) {
  pgm.addColumns('players', {
    avatar: { type: 'text' },
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('players', [ 'avatar' ]);
};

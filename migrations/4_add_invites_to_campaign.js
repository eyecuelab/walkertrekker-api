exports.up = function(pgm) {
  pgm.addColumns('campaigns', {
    invited: { type: 'text ARRAY' },
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('campaigns', [ 'invited' ]);
};

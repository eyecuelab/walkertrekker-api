exports.up = function(pgm) {
  pgm.addColumns('campaigns', {
    host: { type: 'text' },
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('campaigns', [ 'host' ]);
};

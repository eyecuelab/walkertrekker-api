exports.up = function(pgm) {
  pgm.addColumns('campaigns', {
    timezone: {
      type: 'integer',
      validate: {
        min: -12,
        max: 12
      },
    },
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('campaigns', [ 'timezone' ]);
};

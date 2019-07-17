exports.up = function(pgm) {
  pgm.addColumns('journals', {
    eventId: {type: 'string'},
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('journals', [ 'eventId' ]);
};

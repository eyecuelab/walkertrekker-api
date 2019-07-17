exports.up = function(pgm) {
  pgm.addColumns('journals', {
    eventId: {type: 'string'},
    votingList: {type: 'text ARRAY'}
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('journals', [ 'eventId', 'votingList' ]);
};

exports.up = function(pgm) {
  pgm.addColumns('journals', {
    eventNumber: {type: 'integer'},
    votingList: {type: 'text ARRAY'}
  })
};

exports.down = function(pgm) {
  pgm.dropColumns('journals', [ 'eventId', 'votingList' ]);
};

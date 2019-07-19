exports.up = function(pgm) {
  pgm.createType('itemtype', ['food', 'med', 'weapon']);
  pgm.createType('usertype', ['event', 'player']);
};

exports.down = function(pgm) {
  pgm.dropType('itemtype')
  pgm.dropType('usertype')
};

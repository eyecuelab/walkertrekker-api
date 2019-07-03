
exports.up = function(pgm) {
  pgm.createType('eventclass', ['story', 'random']);
  pgm.createType('votetype', ['A', 'B']);
}

exports.down = function(pgm) {
  pgm.dropType('eventclass');
  pgm.dropType('votetype');
}

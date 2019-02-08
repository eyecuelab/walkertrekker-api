exports.up = function(pgm) {
  pgm.createType('campaignlength', ['15', '30', '90']);
  pgm.createType('difficultylevel', ['easy', 'hard', 'xtreme']);
  pgm.createType('randomevents', ['low', 'mid', 'high']);
}

exports.down = function(pgm) {
  pgm.dropType('campaignlength');
  pgm.dropType('difficultylevel');
  pgm.dropType('randomevents');
}

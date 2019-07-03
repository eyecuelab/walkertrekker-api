exports.up = (pgm) => {
  pgm.addColumns("campaigns", {
    completedEvents: { type: "integer ARRAY" }
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("campaigns",['completedEvents'])
};

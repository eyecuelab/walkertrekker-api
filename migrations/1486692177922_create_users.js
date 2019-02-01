exports.up = function(pgm) {
  pgm.createTable('users', { id: { type: 'serial', primaryKey: true },
                             username: { type: 'string' },
                             email: { type: 'string' },
                             phone: { type: 'string' },
                             code: { type: 'string' },
                             imageUrl: { type: 'string' },
                             info: { type: 'jsonb' },
                             confirmed: { type: 'boolean' },
                             authToken: { type: 'string' },
                             authTokenExpiresAt: { type: 'datetime' },
                             createdAt: { type: 'datetime' },
                             updatedAt: { type: 'datetime' }})
};

exports.down = function(pgm) {
  pgm.dropTable('users')
};

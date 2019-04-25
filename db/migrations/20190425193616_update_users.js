
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table){
      table.index(['token'], 'token');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table){
      table.dropIndex(['token'], 'token');
    })
  ])
};


exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table){
        table.string('token');
    }),
    knex.schema.table('categories', function(table){
      table.index(['description'], 'description');
    }),
    knex.schema.table('resources', function(table){
      table.index(['url', 'title', 'description'], 'search');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table){
        table.dropColumn('token');
      }),
    knex.schema.table('categories', function(table){
      table.dropIndex(['description'], 'description');
    }),
    knex.schema.table('resources', function(table){
      table.dropIndex(['url','title', 'description'], 'search');
    })
  ]);
};

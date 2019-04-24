
exports.up = function(knex, Promise) {
  return Promise.all([

    // categories
    knex.schema.createTable('categories', function(table){
      table.increments();
      table.string('description');
    }),

    // rates
    knex.schema.createTable('rates', function(table){
      table.increments();
      table.integer('rate');
    }),

    // users
    knex.schema.table('users', function(table){
      table.dropColumn('name');
      table.string('first_name', 50);
      table.string('last_name', 50);
      table.string('username', 50);
      table.string('email', 200);
      table.string('password');
      table.string('avatar');
    }),

    // resources
    knex.schema.createTable('resources', function(table){
      table.increments();
      table.string('url');
      table.string('title');
      table.string('description');
      table.date('created_on');
      table.bigInteger('created_by').unsigned().index().references('id').inTable('users').onDelete('cascade');
      table.bigInteger('category_id').unsigned().index().references('id').inTable('categories').onDelete('cascade');
    }),

    // comments
    knex.schema.createTable('comments', function(table){
      table.increments();
      table.date('created_on');
      table.string('text');
      table.bigInteger('user_id').unsigned().index().references('id').inTable('users').onDelete('cascade');
      table.bigInteger('resource_id').unsigned().index().references('id').inTable('resources').onDelete('cascade');
    }),

    // resources features
    knex.schema.createTable('resources_references', function (table) {
      table.increments();
      table.bigInteger('resource_id').unsigned().index().references('id').inTable('resources').onDelete('cascade');
      table.bigInteger('user_id').unsigned().index().references('id').inTable('users').onDelete('cascade');
      table.bigInteger('rate_id').unsigned().index().references('id').inTable('rates').onDelete('cascade');
      table.boolean('liked');
    })
  ]);
};

exports.down = function(knex, Promise) {

  return Promise.all([

    // resources features
    knex.schema.dropTable('resources_references'),

    // comments
    knex.schema.dropTable('comments'),

    //users
    knex.schema.table('users', function(table){
      table.string('name');
      table.dropColumn('first_name');
      table.dropColumn('last_name');
      table.dropColumn('username');
      table.dropColumn('email');
      table.dropColumn('password');
      table.dropColumn('avatar');
    }),

    // resources
    knex.schema.dropTable('resources'),

    // categories
    knex.schema.dropTable('categories'),

    //rates
    knex.schema.dropTable('rates')
  ]);
};


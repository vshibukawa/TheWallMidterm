
exports.up = function(knex, Promise) {
  return Promise.all([

    // categories
    knex.schema.createTable('categories', function(table){
      table.increments();
      table.string('description');
      table.index(['description'], 'description');
      // table.foreign('id').references('resources.category_id');
    }),

    // rates
    knex.schema.createTable('rates', function(table){
      table.increments();
      table.integer('rate');
      // table.foreign('id').references('resources_references.rate_id');
    }),

    // users
    knex.schema.createTable('users', function(table){
      table.increments();
      table.string('first_name', 50);
      table.string('last_name', 50);
      table.string('username', 50);
      table.string('email', 200);
      table.string('password');
      table.string('avatar');
      table.string('token');
      table.index(['token'], 'token');
      // table.foreign('id').references('resources.created_by');
      // table.foreign('id').references('resources_references.user_id');
      // table.foreign('id').references('comments.user_id');
    }),

    // resources
    knex.schema.createTable('resources', function(table){
      table.increments();
      table.string('url');
      table.string('title');
      table.string('description');
      table.timestamp('created_on');
      table.bigInteger('created_by').unsigned().index().references('id').inTable('users').onDelete('cascade');
      table.bigInteger('category_id').unsigned().index().references('id').inTable('categories').onDelete('cascade');
      table.index(['url', 'title', 'description'], 'search');
      // table.foreign('id').references('resources_references.resource_id');
      // table.foreign('id').references('comments.resource_id');
    }),

    // comments
    knex.schema.createTable('comments', function(table){
      table.increments();
      table.timestamp('created_on');
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

    // resources
    knex.schema.dropTable('resources'),

    //users
    knex.schema.dropTable('users'),

    // categories
    knex.schema.dropTable('categories'),

    //rates
    knex.schema.dropTable('rates')
  ]);
};


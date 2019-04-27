
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw('alter TABLE comments ALTER COLUMN created_on TYPE timestamp with time zone'),
    knex.raw('alter TABLE resources ALTER COLUMN created_on TYPE timestamp with time zone')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw('alter TABLE comments ALTER COLUMN created_on TYPE date with time zone'),
    knex.raw('alter TABLE resources ALTER COLUMN created_on TYPE date with time zone')
  ]);
};

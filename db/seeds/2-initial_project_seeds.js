exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({
          id: 1,
          first_name: 'Alice',
          last_name: 'Wonderland',
          username: 'whiterabbit',
          email:  'whiterabbit@email.com',
          password:  '12345',
          avatar:  'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
        }),
        knex('users').insert({
          id: 2,
          first_name: 'Bob',
          last_name: 'Marley',
          username: 'chillvibes',
          email:  'chillvibes@email.com',
          password:  '12345',
          avatar:  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
        }),
        knex('users').insert({
          id: 3,
          first_name: 'Charlie',
          last_name: 'Chocolate',
          username: 'willywonka',
          email: 'willywonka@email.com',
          password:  '12345',
          avatar:  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9PqvCqAfsJNWTHMLdwQ0zEKv2ZikLR419IEJssoX7ZrkV4pNP'
        }),

        knex('categories').insert({
          id: 1,
          description: 'candy'
        }),
        knex('categories').insert({
          id: 2,
          description: 'music'
        }),
        knex('categories').insert({
          id: 3,
          description: 'tophats'
        }),

        knex('rates').insert({
          id: 1,
          rate: 0
        }),
        knex('rates').insert({
          id: 2,
          rate: 1
        }),
        knex('rates').insert({
          id: 3,
          rate: 2
        }),
        knex('rates').insert({
          id: 4,
          rate: 3
        }),
        knex('rates').insert({
          id: 5,
          rate: 4
        }),
        knex('rates').insert({
          id: 6,
          rate: 5
        }),

        knex('resources').insert({
          id: 1,
          url: 'http://www.alice-in-wonderland.net/',
          title: 'Wonderland',
          description: 'Good for kids and adults',
          created_on: '2010-08-15',
          created_by: 1,
          category_id: 3
        }),
        knex('resources').insert({
          id: 2,
          url: 'https://en.wikipedia.org/wiki/Bob_Marley',
          title: 'Music',
          description: 'Great music Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula',
          created_on: '2019-12-24',
          created_by: 2,
          category_id: 2
        }),
        knex('resources').insert({
          id: 3,
          url: 'https://en.wikipedia.org/wiki/Willy_Wonka',
          title: 'Willy Wonka Info',
          description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ',
          created_on: '2013-05-23',
          created_by: 3,
          category_id: 1
        }),

        knex('comments').insert({
          id: 1,
          user_id: 1,
          created_on: '2019-11-06',
          text: 'XXXXXXX ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. .',
          resource_id: 2
        }),
        knex('comments').insert({
          id: 2,
          user_id: 2,
          created_on: '2019-11-07',
          text: ':( ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. C',
          resource_id: 3
        }),
        knex('comments').insert({
          id: 3,
          user_id: 3,
          created_on: '2019-11-08',
          text: 'Hellooooooooo ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenea',
          resource_id: 1
        }),

        knex('resources_references').insert({
          id: 1,
          resource_id: 1,
          user_id: 3,
          rate_id: 1,
          liked: false
        }),
        knex('resources_references').insert({
          id: 2,
          resource_id: 2,
          user_id: 1,
          rate_id: 5,
          liked: false
        }),
        knex('resources_references').insert({
          id: 3,
          resource_id: 3,
          user_id: 2,
          rate_id: 3,
          liked: false
        }),

      ]);
    });
};

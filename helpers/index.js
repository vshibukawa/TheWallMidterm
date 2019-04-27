var request         = require("request");

module.exports = (knex) => {
  return{

    getUserIdByToken:  (token) => {
      return new Promise(function(resolve, reject) {
        knex
          .select("*")
          .from("users")
          .where('token', token)
          .then( results => results.length === 1 ? resolve( results[0].id ) : reject('user not found') )
          .catch(e => reject( e ));
      })
    },

    getUserToken: (req, res) => {
      return new Promise(function(resolve, reject){

        if(!req.session.user_id || req.session.user_id === ''){
          reject('Please login or register');
        }

        let token = undefined;

        if(req.params.hasOwnProperty('userToken')){
          token = req.params.userToken;
        }
        if(req.session.hasOwnProperty('user_id')){
          token = req.session.user_id;
        }
        resolve( token );
      })
    },

    getCategoryByDescription: (description) => {
      return new Promise(function(resolve, reject){
        knex
          .select("*")
          .from("categories")
          .where('description', 'ilike', `%${description}%`)
          .then(results => resolve(results))
          .catch(e => reject({ error: 'Categories not found'}));
      });
    },

    createNewCategory: (description) => {
      return new Promise(function(resolve, reject){

        knex('categories').max('id')
          .then(result => result[0].max + 1)
          .then( max => {
            const newCategory = {
                id: max,
                description: description
              };

            knex("categories")
              .insert(newCategory)
              .returning('*')
              .then(results => resolve(results[0]));
          })
          .catch(e => reject( e ));
      });
    },

    checkMandatoryInputs: (input, inputNames) => {
      for(let key of inputNames){
        if( (!input.hasOwnProperty(key)) || (!input[key]) || input[key].replace(/\s/g, '') === ''){
          return false;
        }
      }

      return true;
    }
  }
};

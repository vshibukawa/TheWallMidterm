var request         = require("request");

module.exports = (knex) => {
  return{

    getUserIdByToken: (token) => {
      knex
        .select("*")
        .from("users")
        .where('token', token)
        .then( results => results.length !== 1 ? undefined : results[0].id)
        .catch(e => res.status(400).json( e ));
    },

    getUserToken: (req, res) => {

      if(!req.params.userToken || req.params.userToken === '' || !req.session.user_id || req.session.user_id === ''){
        return { error: 'Please login or register', user: null} ;
      }

      let token = undefined;

      if(req.params.hasOwnProperty('userToken')){
        token = req.params.userToken;
      }
      if(req.session.hasOwnProperty('user_id')){
        token = req.session.user_id;
      }
      return token;
    }
  }
};

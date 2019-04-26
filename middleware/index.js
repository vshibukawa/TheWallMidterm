var request         = require("request");

module.exports = (knex) => {
  const helpers     = require('../helpers/index')(knex);

  return{

    isLoggedIn: (req, res, next) => {
      if(!req.session.user_id || req.session.user_id === ''){
        return res.status(400).json( {error: 'Please login or register'} );
      }
      return next ;
    },

    isValidToken: (req, res, next) => {
      if(!req.params.userToken || req.params.userToken === ''){
        return res.status(400).json( {error: 'Please login or register'} );
      }

      if(!helpers.getUserIdByToken(req.params.userToken)){
        return res.status(400).json( {error: 'Invalid Token'} );
      }

      return next ;
    },

    isUserResource: (req, res, next) =>{
      helpers.getUserToken(req, res)
        .then(token => helpers.getUserIdByToken( token ))
        .then(userId => {

          knex
            .select('user_id')
            .from("resource")
            .where('id', req.params.id)
            .then(results => {
              if(results.length === 0){ return res.status(400).json( {error: 'resource not found'} )}
              if(results[0].userId !== userId){ return res.status(400).json( {error: 'Unauthorized'} )}
              return next;
            })
            .catch(e => res.status(400).json( e ));
        });
    },

    isUserComment: (req, res, next) =>{

      helpers.getUserToken(req, res)
        .then(token => helpers.getUserIdByToken( token ))
        .then(userId => {
          knex
            .select('user_id')
            .from("comments")
            .where('id', req.params.id)
            .then(results => {
              if(results.length === 0){ return res.status(400).json( {error: 'comment not found'} )}
              if(results[0].userId !== userId){ return res.status(400).json( {error: 'Unauthorized'} )}
              return next;
            })
            .catch(e => res.status(400).json( e ));
        });
    }
  };
}

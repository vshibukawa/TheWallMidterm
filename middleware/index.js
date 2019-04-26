var request         = require("request");
const helpers       = require('../helpers/index');

module.exports = {

  isLoggedIn: function(req, res, next){
    if(!req.session.user_id || req.session.user_id === ''){
      return res.status(400).json( {error: 'Please login or register'} );
    }
    return next ;
  },

  isValidToken: function(req, res, next){
    if(!req.params.userToken || req.params.userToken === ''){
      return res.status(400).json( {error: 'Please login or register'} );
    }

    if(!helpers.getUserId(req.params.userToken)){
      return res.status(400).json( {error: 'Invalid Token'} );
    }

    return next ;
  }

  // isUserResource: function(req, res, next){

  // },

  // isUserComment:function(req, res, next){

  // },
};

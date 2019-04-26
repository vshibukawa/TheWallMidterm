var request         = require("request");

module.exports = {

  isLoggedIn: function(req, res, next){
    if(!req.session.user_id || req.session.user_id = ''){
      return res.status(400).json( {error: 'Please login or register'} );
    }
  } //,

  // isUserResource: function(req, res, next){

  // },

  // isUserComment:function(req, res, next){

  // },
};

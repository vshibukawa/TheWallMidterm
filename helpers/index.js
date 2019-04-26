var request         = require("request");

module.exports = {

  getUserId: function(token){
    knex
      .select("*")
      .from("users")
      .where('token', token)
      .then( results => results.length !== 1 ? undefined : results[0].id);
  }
};

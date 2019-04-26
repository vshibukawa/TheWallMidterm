var request         = require("request");

module.exports = {

  getUserId: function(token){
    knex
      .select("*")
      .from("users")
      .where('token', token)
      .then( results => results.length !== 1 ? return undefined : return results[0].id);
  }
};

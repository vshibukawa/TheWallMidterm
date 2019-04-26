"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const middleware        = require('../middleware/index')(knex);
  const helperCategories  = require("../helpers/userCategories")(knex);
  const helperUsers       = require("../helpers/users")(knex);
  const helperResources  = require("../helpers/resources")(knex);

  router.route('/register')
        .post( helperUsers.register );


  router.route('/login')
        .put( helperUsers.login );

  router.route('/logout')
        .post( helperUsers.logout );

  router.route("/categories")
        .all( middleware.isLoggedIn )
        .get((req, res) => helperCategories.getCategories (req, res, req.session.user_id));

  router.route('/:userToken/resources')
        .all( middleware.isLoggedIn )
        .get( helperResources.getUsersReources );

  // get user profile info
  router.route("/:id")
    .get(helperUsers.getUser)
    .put(helperUsers.updateUser);

  return router;
}

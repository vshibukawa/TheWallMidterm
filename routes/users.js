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

  // router.route("/:userToken/categories")
  //       .all( middleware.isValidToken )
  //       .get((req, res) => helperCategories.getCategories (req, res, req.params.userToken));

  router.route("/categories")
        .all( middleware.isLoggedIn )
        .get((req, res) => helperCategories.getCategories (req, res, req.session.user_id))
        // .get((req, res) => helperCategories.getCategories (req, res, req.session.user_id));

  router.route('/:userToken/resources')
        .all( middleware.isValidToken )
        .get( helperResources.getUsersReources );

  // get user profile info
  router.route("/:userToken")
    .get(helperUsers.getUser)
    .put(helperUsers.updateUser);

  return router;
}

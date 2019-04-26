"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const middleware        = require('../middleware/index')(knex);
  const helperCategories  = require("../helpers/userCategories")(knex);
  const helperUsers       = require("../helpers/users")(knex);

  router.route('/register')
        .post( helperUsers.register );

  router.route('/login')
        .put( helperUsers.login );

  router.route('/logout')
        .post( helperUsers.logout );

  router.route("/categories")
        .all( middleware.isLoggedIn )
        .get((req, res) => helperCategories.getCategories (req, res, req.session.user_id));

  // // delete resource
  // router.delete("/:userToken/resources/:id", middleware.isValidToken, (req, res) => {
  //   helpers.deleteResource(req, res, req.params.userToken, knex);
  // });
  // // update resource
  // router.put("/:userToken/resources/:id", middleware.isValidToken, (req, res) => {
  //   helpers.updateResource(req, res, req.params.userToken, knex);
  // });

  // // update resource
  // router.post("/:userToken/resources/", middleware.isValidToken,  (req, res) => {
  //   helpers.createResource(req, res, req.params.userToken, knex);
  // });

  // get user's categories


  // router.get("/", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("users")
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });



  return router;
}

"use strict";

const express     = require('express');
const url         = require('url');
const querystring = require('querystring');
const router      = express.Router();

module.exports = (knex) => {
  const middleware        = require('../middleware/index')(knex);
  const helper            = require("../helpers/userCategories")(knex);
  const helperCategories  = require("../helpers/categories")(knex);


  // router.get("/:userToken/categories/:categoryId/resources", middleware.isValidToken,  (req, res) => {
  //   helper.getResourcesByCategories (req, res, req.params.userToken);
  // });
  // router.get("/:userToken/categories", middleware.isValidToken, (req, res) => {
  //   helper.getCategories (req, res, req.params.userToken);
  // });

  router.route("/:categoryId/resources")
        .all( middleware.isLoggedIn )
        .get((req, res) => helper.getResourcesByCategories (req, res, req.session.user_id));

  // router.get("/resources",  , (req, res) => {
  //   helper.getResourcesByCategories (req, res, req.session.user_id);
  // });

  // router.get("/resources", middleware.isLoggedIn, (req, res) => {
  //   helper.getCategories (req, res, req.session.user_id);
  // });

  router.route('/:id')
        .all( middleware.isLoggedIn )
        .put( helperCategories.updateCategory )
        .delete( helperCategories.deleteCategory );
  router.route('/:id')
        .get( helperCategories.getCategory );

  router.route('/')
        .all( middleware.isLoggedIn )
        .post( helperCategories.createCategory );
  router.route('/')
        .get( helperCategories.getCategories );

  return router;
}

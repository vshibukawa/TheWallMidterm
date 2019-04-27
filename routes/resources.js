"use strict";

const express     = require('express');
const router      = express.Router();

module.exports = (knex) => {
  const middleware      = require('../middleware/index')(knex);
  const helpers         = require('../helpers/resources')(knex);
  const helpersComments = require('../helpers/comments')(knex);

  // comments
  router.route('/:resourceId/comments/:id')
        .all( middleware.isLoggedIn )
        .all( middleware.isUserComment )
        .delete( helpersComments.deleteComment );

  router.route('/:resourceId/comments/')
        // .all( middleware.isLoggedIn )
        .get( helpersComments.getComments )
        .post((req, res) => helpersComments.createComment(req, res, req.session.user_id) );

  // get resource main data
  router.route("/:id")
        .get( helpers.getResources );

  router.route('/:id')
        // .all( middleware.isLoggedIn )
        .put( (req, res) => helpers.updateResource(req, res, req.session.user_id, knex));
  // // update resource
  // router.put("/:id", middleware.isLoggedIn,  (req, res) => {
  //   helpers.updateResource(req, res, req.session.user_id, knex);
  //   // res.redirect(`/${req.session.user_id}/resources/${req.params.id}`);
  // });

  router.route('/')
        // .all( middleware.isLoggedIn )
        .post( (req, res) => helpers.createResource(req, res, req.session.user_id, knex));
  // // update resource
  // router.post("/", middleware.isLoggedIn,  (req, res) => {
  //   helpers.createResource(req, res, req.session.user_id, knex);
  // });

  router.route('/:id')
        .all( middleware.isLoggedIn )
        .all( middleware.isUserResource )
        .delete((req, res) => helpers.deleteResource(req, res, req.session.user_id, knex))

  // // // delete resource
  // // router.delete("/:id", middleware.isLoggedIn, (req, res) => {
  // //   helpers.deleteResource(req, res, req.session.user_id, knex);
  // //   // res.redirect(`/${req.session.user_id}/resources/${req.params.id}`);
  // // });
  //
  router.route("/")
        .get( helpers.getReourcesByQuery );

  return router;
}

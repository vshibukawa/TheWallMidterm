"use strict";

const express     = require('express');
const url         = require('url');
const querystring = require('querystring');
const router      = express.Router();
const middleware  = require('../middleware/index');
const helpers     = require('../helpers/resources');

module.exports = (knex) => {

  // router.route('/:userToken/resources/:resourceId/comments/:id')
  //       .all(middleware.isValidToken)
  //       .delete();

  // router.route('/resources/:resourceId/comments/:id')
  //       .all(middleware.isLoggedIn)
  //       .delete();

  // router.route('/:userToken/resources/:resourceId/comments/')
  //       .delete()
  //       .post();

  // router.route('/resources/:resourceId/comments/')
  //       .all(middleware.isLoggedIn)
  //       .delete()
  //       .post();

  // delete resource
  router.delete("/:userToken/resources/:id", middleware.isValidToken, (req, res) => {
    helpers.deleteResource(req, res, req.params.userToken, knex);
  });

  // delete resource
  router.delete("/:id", middleware.isLoggedIn, (req, res) => {
    helpers.deleteResource(req, res, req.session.user_id, knex);
    // res.redirect(`/${req.session.user_id}/resources/${req.params.id}`);
  });

  // update resource
  router.put("/:userToken/resources/:id", middleware.isValidToken, (req, res) => {
    helpers.updateResource(req, res, req.params.userToken, knex);
  });

  // update resource
  router.put("/:id", middleware.isLoggedIn,  (req, res) => {
    helpers.updateResource(req, res, req.session.user_id, knex);
    // res.redirect(`/${req.session.user_id}/resources/${req.params.id}`);
  });

    // update resource
  router.post("/:userToken/resources/", middleware.isValidToken,  (req, res) => {
    helpers.createResource(req, res, req.params.userToken, knex);
  });

  // update resource
  router.post("/", middleware.isLoggedIn,  (req, res) => {
    helpers.createResource(req, res, req.session.user_id, knex);
  });

  // get resource main data
  router.get("/:id", (req, res) => {

    knex
      .select('res.id', 'res.url', 'res.title', 'res.description', 'res.created_on',
        'res.created_by as created_by_id', 'users.username',
        knex.raw(`sum(rate)/count(ref.user_id) as rate`),
        knex.raw(`sum(case
            when liked = true then 1
            else 0
            end) as likes`),
        knex.raw('count(com.id)  as comments'),
        'cat.id as category_id', 'cat.description as category_description')
      .from("resources as res")
      .innerJoin('users', 'users.id', 'res.created_by')
      .innerJoin('resources_references as ref', 'ref.resource_id', 'res.id')
      .innerJoin('rates', 'rates.id', 'ref.rate_id ')
      .innerJoin('comments as com', 'com.resource_id', 'res.id ')
      .innerJoin('categories as cat', 'cat.id', 'res.category_id ')
      .groupBy('res.id', 'users.username', 'cat.id')
      .where('res.id', req.params.id)
      .then(results => res.json(results))
      .catch(e => res.status(400).json( {e} ));
  });

  router.get("/", (req, res) => {

    const parsedUrl = url.parse(req.originalUrl);
    const parsedQs = querystring.parse(parsedUrl.query);
    const { search, limit } = parsedQs;

    if(search){

      const searchFor = `%${ search }%`;

      knex
        .select('res.id', 'res.url', 'res.title', 'res.description', 'res.created_on',
          'res.created_by as created_by_id', 'users.username',
          knex.raw(`sum(rate)/count(ref.user_id) as rate`),
          knex.raw(`sum(case
              when liked = true then 1
              else 0
              end) as likes`),
          knex.raw('count(com.id)  as comments'),
          'cat.id as category_id', 'cat.description as category_description')
        .from("resources as res")
        .innerJoin('users', 'users.id', 'res.created_by')
        .innerJoin('resources_references as ref', 'ref.resource_id', 'res.id')
        .innerJoin('rates', 'rates.id', 'ref.rate_id ')
        .innerJoin('comments as com', 'com.resource_id', 'res.id ')
        .innerJoin('categories as cat', 'cat.id', 'res.category_id ')
        .where('cat.description', 'ilike', searchFor)
        .orWhere('res.url', 'ilike', searchFor)
        .orWhere('res.title', 'ilike', searchFor)
        .orWhere('res.description', 'ilike', searchFor)
        .groupBy('res.id', 'users.username', 'cat.id')
        .orderBy('rate', 'desc')
        .limit(limit)
        .then( results => res.json(results))
        .catch(e => res.status(400).json( {e} ));

    }else{

      if(limit){
        knex
          .select('res.id', 'res.url', 'res.title', 'res.description', 'res.created_on',
            'res.created_by as created_by_id', 'users.username',
            knex.raw(`sum(rate)/count(ref.user_id) as rate`),
            knex.raw(`sum(case
                when liked = true then 1
                else 0
                end) as likes`),
            knex.raw('count(com.id)  as comments'),
            'cat.id as category_id', 'cat.description as category_description')
          .from("resources as res")
          .innerJoin('users', 'users.id', 'res.created_by')
          .innerJoin('resources_references as ref', 'ref.resource_id', 'res.id')
          .innerJoin('rates', 'rates.id', 'ref.rate_id ')
          .innerJoin('comments as com', 'com.resource_id', 'res.id ')
          .innerJoin('categories as cat', 'cat.id', 'res.category_id ')
          .groupBy('res.id', 'users.username', 'cat.id')
          .orderBy('rate', 'desc')
          .limit(limit)
          .then( results => res.json(results))
          .catch(e => res.status(400).json( {e} ));
      }
    }
  });

  return router;
}

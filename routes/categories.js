"use strict";

const express     = require('express');
const url         = require('url');
const querystring = require('querystring');
const router      = express.Router();
const middleware  = require('../middleware/index');
const helper      = require("../helpers/userCategories");

module.exports = (knex) => {

  router.get("/:userToken/categories/:categoryId/resources", (req, res) => {
    helper.getResourcesByCategories: (req, res, req.params.userToken);
  });

  router.get("/resources", middleware.isLoggedIn, (req, res) => {
    helper.getResourcesByCategories: (req, res, req.session.user_id);
  });

  router.get("/:userToken/categories", (req, res) => {
    helper.getCategories: (req, res, req.params.userToken);
  });

  router.get("/resources", middleware.isLoggedIn, (req, res) => {
    helper.getCategories: (req, res, req.session.user_id);
  });


  // create category
  router.post("/", (req, res) => {
    knex('categories').max('id')
      .then(result => result[0].max + 1)
      .then( max => {
        const newCategory = {
            id: max,
            description: req.body.description
          };

        knex("categories")
          .insert(newCategory)
          .then(results =>  res.json(newCategory));
      })
      .catch(e => res.status(400).json( {e} ));
  });

  // update category
  router.put("/:id", (req, res) => {
    const updateCategory = {
            id: req.params.id,
            description: req.body.description
          };

    knex("categories")
      .where('id', req.params.id)
      .update({
        description: req.body.description
      })
      .then(result => {
        if(result === 1){ return res.
          status(200).json( updateCategory ); }
      })
      .catch(e => res.status(400).json( {e} ));
  });

  // delete category
  router.delete("/:id", (req, res) => {
    knex
      .select('res.id', 'cat.description')
      .from("resources as res")
      .innerJoin('categories as cat', 'cat.id', 'res.category_id ')
      .groupBy('res.id', 'users.username', 'cat.id')
      .where('users.token', req.params.userToken)
      .andWhere('cat.id', req.params.categoryId)
      .then(results => {
        const length = results.length;
        if(length > 0) { return res.status(400).json( {error: `Cannot delete category ${results[0].description} because there are ${length} resources in this category` });}

        knex("categories")
          .where('id', req.params.id)
          .del()
          .then(result => {
            if(result === 1){ return res.status(200).json( {success: 'Deleted' }); }
          })
          .catch(e => res.status(400).json( {e} ));
      })
      .catch(e => res.status(400).json( e ));
  });

  // get category
  router.get("/:id", (req, res) => {
    knex
      .select("*")
      .from("categories")
      .where('id', req.params.id)
      .then(results => res.json(results[0]))
      .catch(e => res.status(400).json({ error: 'Category not founs'}));
  });

  // get categories
  router.get("/", (req, res) => {

    const parsedUrl = url.parse(req.originalUrl);
    const parsedQs = querystring.parse(parsedUrl.query);
    const { description } = parsedQs;

    if(description){
      knex
        .select("*")
        .from("categories")
        .where('description', 'ilike', `%${description}%`)
        .then(results => res.json(results))
        .catch(e => res.status(400).json({ error: 'Categories not founs'}));

    }else{

      knex
        .select("*")
        .from("categories")
        .then(results => res.json(results))
        .catch(e => res.status(400).json({ error: 'Categories not founs'}));
    }
  });

  return router;
}

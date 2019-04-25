"use strict";

const express     = require('express');
const url         = require('url');
const querystring = require('querystring');
const router      = express.Router();

module.exports = (knex) => {

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
        if(result === 1){ return res.status(200).json( updateCategory ); }
      })
      .catch(e => res.status(400).json( {e} ));
  });

  // delete category
  router.delete("/:id", (req, res) => {
    knex("categories")
      .where('id', req.params.id)
      .del()
      .then(result => {
        if(result === 1){ return res.status(200).json( {success: 'Deleted' }); }
      })
      .catch(e => res.status(400).json( {e} ));
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

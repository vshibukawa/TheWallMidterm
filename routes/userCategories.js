"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:userId/categories/:categoryId/resources", (req, res) => {
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
      .where('users.id', req.params.userId)
      .andWhere('cat.id', req.params.categoryId)
      .then(results => res.json(results[0]))
      .catch(e => res.status(400).json( e ));
  });

  router.get("/:userId/categories", (req, res) => {
    knex
      .select('cat.id', 'cat.description')
      .from('categories as cat')
      .innerJoin('resources as res', 'res.category_id', 'cat.id')
      .innerJoin('users', 'users.id', 'res.created_by')
      .innerJoin('resources_references as ref', 'ref.resource_id', 'res.id')
      .where('users.token', req.params.userId)
      .groupBy('cat.id')
      .orderBy('cat.description')
      .then(results => res.json(results[0]))
      .catch(e => res.status(400).json( e ));
  });

  return router;
}

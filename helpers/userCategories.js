"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const helpers = require('../helpers/index')(knex);

  return{

    getResourcesByCategories: (req, res, token) => {
      helpers.getUserIdByToken(token)
        .then(userId => {

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
            .leftOuterJoin('resources_references as ref', 'ref.resource_id', 'res.id')
            .leftOuterJoin('rates', 'rates.id', 'ref.rate_id ')
            .leftOuterJoin('comments as com', 'com.resource_id', 'res.id ')
            .leftOuterJoin('categories as cat', 'cat.id', 'res.category_id ')
            .groupBy('res.id', 'users.username', 'cat.id')
            .where(function() { this.where('res.created_by', userId).orWhere(function() { this.where('ref.user_id', userId).andWhere('ref.liked', true) })})
            .andWhere('cat.id', req.params.categoryId)
            .then(results => res.json(results))
            .catch(e => res.status(400).json( e ));
        })
        .catch(e => res.status(400).json( e ));
    },

    getCategories: (req, res, token) => {

      helpers.getUserIdByToken(token)
        .then(userId => {

          knex
            .select('cat.id', 'cat.description')
            .from('categories as cat')
            .leftOuterJoin('resources as res', 'res.category_id', 'cat.id')
            .leftOuterJoin('users', 'users.id', 'res.created_by')
            .leftOuterJoin('resources_references as ref', 'ref.resource_id', 'res.id')
            .where('res.created_by', userId)
            .orWhere(function() { this.where('ref.user_id', userId).andWhere('ref.liked', true) })
            .groupBy('cat.id')
            .orderBy('cat.description')
            .then(results => res.json(results))
            .catch(e => res.status(400).json( e ));
        })
        .catch(e => res.status(400).json( e ));
    }
  }

}

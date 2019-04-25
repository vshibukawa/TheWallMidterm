"use strict";

const express     = require('express');
const url         = require('url');
const querystring = require('querystring');
const router      = express.Router();


module.exports = (knex) => {

  router.get("/", (req, res) => {

    const parsedUrl = url.parse(req.originalUrl);
    const parsedQs = querystring.parse(parsedUrl.query);
    const { search, limit } = parsedQs;

    if(search){

      // knex
      //   .select("*")
      //   .from("users")
      //   .then((results) => {
      //     res.json(results);
      // });

    }

    if(limit){
      // select res.id, res.url, res.title, res.description, res.created_on,
      // res.created_by as created_by_id, users.username,
      // (sum(rate)/count(ref.user_id)) as rate,
      // sum(case
      // when liked = true then 1
      // else 0
      // end) as likes, count(com.id) as comments,
      // cat.id as category_id, cat.description as category_description
      // from resources res
      // inner join users
      // on users.id = res.created_by
      // inner join resources_references ref
      // on ref.resource_id = res.id
      // inner join rates
      // on rates.id = ref.rate_id
      // inner join comments com
      // on com.resource_id = res.id
      // inner join categories as cat
      // on cat.id = res.category_id
      // group by res.id
      // order by rate desc
      // limit 2;

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
        .then((results) => {
          res.json(results);
      });
    }
  });

  return router;
}

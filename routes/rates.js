"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const helpers = require('../helpers/rates')(knex);

  router.route("/:id")
        .get( helpers.getRate );

  router.route("/")
        .get( helpers.getRates );

  // router.get("/:id", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("rates")
  //     .where('id', req.params.id)
  //     .then(results => res.json(results[0]))
  //     .catch(e => res.status(400).json( {e} ));
  // });

  // router.get("/", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("rates")
  //     .then(results => res.json(results))
  //     .catch(e => res.status(400).json( {e} ));
  // });

  return router;
}

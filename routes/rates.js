"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    knex
      .select("*")
      .from("rates")
      .where({id: req.params.id})
      .then(results => res.json(results[0]))
      .catch(e => res.status(400).json( {e} ));
  });

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("rates")
      .then(results => res.json(results))
      .catch(e => res.status(400).json( {e} ));
  });

  return router;
}

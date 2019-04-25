"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    knex
      .select("*")
      .from("rates")
      .where({id: req.params.id})
      .then((results) => {
        res.json(results[0]);
    });
  });

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("rates")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}

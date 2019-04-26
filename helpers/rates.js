"use strict";

const express = require('express');

module.exports = (knex) => {

  return{

    getRate: (req, res) => {
      knex
        .select("*")
        .from("rates")
        .where('id', req.params.id)
        .then(results => res.json(results[0]))
        .catch(e => res.status(400).json( {e} ));
    },

    getRates: (req, res) => {
      knex
        .select("*")
        .from("rates")
        .then(results => res.json(results))
        .catch(e => res.status(400).json( {e} ));
    }
  }
}

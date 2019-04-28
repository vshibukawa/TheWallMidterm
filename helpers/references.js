"use strict";

const express     = require('express');
const router      = express.Router();


module.exports = (knex) => {
  const helpers = require('../helpers/index')(knex);

  return {
    getReferences: (req, res) => {
      helpers.getUserIdByToken( req.session.user_id )
        .then(userId => {
          knex
            .select('*')
            .from("resources_references")
            .where('resource_id', req.params.resourceId)
            .andWhere('user_id', userId)
            .then(result => {
              res.status(200).send(result);
            })
        })
        .catch(e => res.status(400).json( {e} ));
    }
  };
}

"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const helpers = require('../helpers/index')(knex);

  return{

    deleteComment: (req, res) => {
      knex("comments")
        .where('id', req.params.id)
        .del()
        .then(result => {
          if(result === 1){ return res.status(200).json( {success: 'Deleted' }); }
        })
        .catch(e => res.status(400).json( {e} ));
    },

    createComment: async (req, res) => {
      if(!req.body.hasOwnProperty('text')){
        return res.status(400).json( {error: 'text is empty'} );
      }

      const userId = await helpers.getUserIdByToken( helpers.getUserToken(req, res) );

      knex("comments").max('id')
        .then(result => result[0].max + 1)
        .then( max => {
          const { text } = req.body;
          const newComment = {
            id: max,
            user_id: userId,
            created_on: new Date(),
            text,
            resource_id: req.params.resourceId
          };

          knex('comments').insert({newComment})
            .then(results =>  res.json(newComment));
        })
        .catch(e => res.status(400).json( e ));
    },

    getComments: (req, res) => {
      knex
        .select('*')
        .from("comments")
        .where('resource_id', req.params.resourceId)
        .then(results => res.status(200).json( results ))
        .catch(e => res.status(400).json( e ));
    }
  }

}

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

    createComment: (req, res, token) => {
      if(!req.body.hasOwnProperty('text') || req.body.text === ""){
        return res.status(400).json( {error: 'Enter valid comment.'} );
      }

      helpers.getUserIdByToken(token)
        .then(userId => {
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
              console.log('newComments :', newComment)
              knex('comments')
                .returning(['id', 'user_id', 'created_on', 'text', 'resource_id'])
                .insert(newComment)
                .then(results => {
                  console.log('completed comment', results);
                  res.json(newComment)});
            })
            .catch(e => res.status(400).json( e ));
        })
    },

    getComments: (req, res) => {
      knex
        .select('com.id', 'com.user_id', 'users.username', 'com.created_on', 'com.text', 'com.resource_id')
        .from("comments as com")
        .innerJoin('users', 'users.id', 'com.user_id')
        .where('resource_id', req.params.resourceId)
        .orderBy('created_on', 'asc')
        .then(results => res.status(200).send( results ))
        .catch(e => res.status(400).send( e ));
    }
  }

}

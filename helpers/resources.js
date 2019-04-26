"use strict";

const express = require('express');
const router  = express.Router();
const helpers = require('../helpers/index');

async function deleteResource (req, res, token, knex){
  const userId = await helpers.getUserId(token);

  // check if it is the user who created it
  knex
    .select('created_by')
    .from("resources")
    .where('id', req.params.id)
    .then(results => {
      if(results.length === 0){ return res.status(400).json( {error: 'Resource not found'} ) }
      if(results.created_by !== userId){ return res.status(400).json( {error: "You cannot delete the resource because you haven't create it"} ) }

      knex("resources")
        .where('id', req.params.id)
        .del()
        .then(res.status(200).json( {success: 'Deleted' }))
    })
    .catch(e => res.status(400).json( {e} ));
}

async function updateResource (req, res, token, knex){

  const userId = await helpers.getUserId(token);
  const updateResource = {};
  const updateRefrences = {};

  if(req.body.hasOwnProperty('url')){
    updateResource['url'] = req.body.url;
  }
  if(req.body.hasOwnProperty('text')){
    updateResource['text'] = req.body.text;
  }
  if(req.body.hasOwnProperty('description')){
    updateResource['description'] = req.body.description;
  }
  if(req.body.hasOwnProperty('category_id')){
    updateResource['category_id'] = req.body.category_id;
  }

  if(req.body.hasOwnProperty('liked')){
    updateRefrences['liked'] = req.body.liked;
  }
  if(req.body.hasOwnProperty('rate_id')){
    updateRefrences['rate_id'] = req.body.rate_id;
  }

  knex
    .select('*')
    .from("resources")
    .where('id', req.params.id)
    .andWhere('user_id')
    .then(results => {

      if(!updateResource.isEmpty()){
        if(results.created_by !== userId){ return res.status(400).json( {error: "You cannot edit the resource because you haven't create it"} ) }
          knex("resources")
          .where('id', results[0].id)
          .update(updateResource)
          .then(result => {
            if(result === 1){
              updateResource.id = results[0].id;
              updateResource.created_on = results[0].created_on;
              updateResource.created_by = results[0].created_by;
              return res.status(200).json( updateResource );
            }
          })
          .catch(e => res.status(400).json( {e} ));
      }

      if(!updateRefrences.isEmpty()){
        if(results.created_by !== userId){ return res.status(400).json( {error: "You cannot like/rate the resource because you create it"} ) }

        knex
          .select('*')
          .from('resources_references')
          .where('res.id', req.params.id)
          .then(results => {

            const length = results.length;
            const referenceFound = results.filter(result => result.user_id === userId);

            // create new refrence
            if(length === 0 || referenceFound.length === 0){
              const maxId = Math.max.apply(Math, results.map(result => result.id ));
              const createReference = {
                  id: maxId++,
                  resource_id: req.params.id,
                  user_id: userId,
                  rate_id: updateRefrences.rate_id,
                  liked: false
                }
              if(updateRefrences.liked){ createReference.liked = true; }

              knex('resources_references')
                .insert(createReference)
                .then(res.status(200).json( createReference ))
                .catch(e => res.status(400).json( {e} ));

            // update
            }else if(referenceFound){
              const updtReference = {
                  id: maxId++,
                  resource_id: req.params.id,
                  user_id: userId,
                  rate_id: updateRefrences.rate_id,
                  liked: false
                }
              if(updateRefrences.liked){ createReference.liked = true; }

              knex("resources_references")
                .where('resource_id', req.params.id)
                .andWhere('user_id', userId)
                .update(updtReference)
                .then(result => {
                  if(result === 1){
                    updtReference.resource_id = req.params.id;
                    updtReference.user_id = userId;
                    return res.status(200).json( updtReference );
                  }
                })
                .catch(e => res.status(400).json( {e} ));
            }
          })
          .catch(e => res.status(400).json( {e} ));
      }
    })
    .catch(e => res.status(400).json( {e} ));
}

module.exports.deleteResource = deleteResource;
module.exports.updateResource = updateResource;

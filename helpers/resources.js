"use strict";

const express     = require('express');
const url         = require('url');
const querystring = require('querystring');
const router      = express.Router();

const setUpdateQueries = (body) => {
  const updateResource = {};
  const updateRefrences = {};

  if(body.hasOwnProperty('url')){
    updateResource['url'] = body.url;
  }
  if(body.hasOwnProperty('text')){
    updateResource['text'] = body.text;
  }
  if(body.hasOwnProperty('description')){
    updateResource['description'] = body.description;
  }
  if(body.hasOwnProperty('category_id')){
    updateResource['category_id'] = body.category_id;
  }

  if(body.hasOwnProperty('liked')){
    updateRefrences['liked'] = body.liked;
  }
  if(body.hasOwnProperty('rate_id')){
    updateRefrences['rate_id'] = body.rate_id;
  }

  return { updateResource, updateRefrences };
};

const getResourceByID = (id) => {
  return new Promise(function(resolve, reject){
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
      .innerJoin('rates', 'rates.id', 'ref.rate_id ')
      .innerJoin('comments as com', 'com.resource_id', 'res.id ')
      .innerJoin('categories as cat', 'cat.id', 'res.category_id ')
      .groupBy('res.id', 'users.username', 'cat.id')
      .where('res.id', id)
      .then(results => resolve(results))
      .catch(e => reject(e));
  });
}

module.exports = (knex) => {
  const helpers = require('../helpers/index')(knex);

  return{
    getResource: (req, res) => {
      getResourceByID(req.params.id)
        .then( () => resultsres.json(results) )
        .catch(e => res.status(400).json( e ));
    },

    getUsersReources:  (req, res) => {
      helpers.getUserIdByToken( req.params.userToken )
        .then(userId => {

          knex
            .select('res.id')
            .from("resources as res")
            .leftOuterJoin('resources_references as ref', 'ref.resource_id', 'res.id')
            .where(function() { this.where('ref.user_id', userId).orWhere('ref.liked', true) })
            .then( results => {

              if(results.length === 0){return res.status(200).json( [] );}

              const ids = [];
              results.forEach(result => ids.push(result.id));

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
                .innerJoin('rates', 'rates.id', 'ref.rate_id ')
                .innerJoin('comments as com', 'com.resource_id', 'res.id ')
                .innerJoin('categories as cat', 'cat.id', 'res.category_id ')
                .whereIn('res.id', ids)
                .groupBy('res.id', 'users.username', 'cat.id')
                .then(results => res.json(results))
            })
        })
        .catch(e => res.status(400).json( {e} ));
    },

    getReourcesByQuery: (req, res) => {

      const parsedUrl = url.parse(req.originalUrl);
      const parsedQs = querystring.parse(parsedUrl.query);
      const { search, limit } = parsedQs;

      if(search){

        const searchFor = `%${ search }%`;

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
          .innerJoin('rates', 'rates.id', 'ref.rate_id ')
          .innerJoin('comments as com', 'com.resource_id', 'res.id ')
          .innerJoin('categories as cat', 'cat.id', 'res.category_id ')
          .where('cat.description', 'ilike', searchFor)
          .orWhere('res.url', 'ilike', searchFor)
          .orWhere('res.title', 'ilike', searchFor)
          .orWhere('res.description', 'ilike', searchFor)
          .groupBy('res.id', 'users.username', 'cat.id')
          .orderBy('rate', 'desc')
          .limit(limit)
          .then( results => res.json(results))
          .catch(e => res.status(400).json( {e} ));

      }else{

        if(limit){
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
            .innerJoin('rates', 'rates.id', 'ref.rate_id ')
            .innerJoin('comments as com', 'com.resource_id', 'res.id ')
            .innerJoin('categories as cat', 'cat.id', 'res.category_id ')
            .groupBy('res.id', 'users.username', 'cat.id')
            .orderBy('rate', 'desc')
            .limit(limit)
            .then( results => res.json(results))
            .catch(e => res.status(400).json( {e} ));
        } // end of if limit
      } // end of if search
    } // end of getReourcesByQuery

    deleteResource: function(req, res, token, knex){
      helpers.getUserIdByToken(token)
        .then(userId => {

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
        });
    },

    updateResource: function  (req, res, token, knex){
      helpers.getUserIdByToken(token)
        .then(userId => {
          const { updateResource , updateRefrences } = setUpdateQueries(req.body.url);

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
                    const maxId = Math.max.apply(Math, results.map(result => result.id ));

                    // create new refrence
                    if(length === 0 || referenceFound.length === 0){
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
                        .then(() => {
                          getResourceByID(req.params.id)
                            .then( () => res.status(200).json(results) )
                            .catch(e => res.status(400).json( e ));
                        })
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
                            getResourceByID(req.params.id)
                              .then( () => res.status(200).json(results) )
                              .catch(e => res.status(400).json( e ));
                          }
                          res.status(400).json( {error: "Couldn't create resource references"} )
                        })
                    }
                  })
              }
            })
            .catch(e => res.status(400).json( {e} ));
          }) ;
    },

    createResource: function  (req, res, token, knex){
      helpers.getUserIdByToken(token)
        .then(userId => {

          knex('resources').max('id')
            .then(result => result[0].max + 1)
            .then( max => {

              const { url, title, description, category_id } = req.body;
              const newResource = {
                id: max,
                url,
                title,
                description,
                created_on: new Date(),
                created_by: userId,
                category_id
              };

              if(req.body.hasOwnProperty('category_id')){
                newResource.category_id = req.body.category_id;
              }

              knex('resources').insert({newResource})
                .then(results =>  results.length === 1 ? res.json(newResource) : res.status(400).json( {error: "Couldn't create resource"} ));
            })
            .catch(e => res.status(400).json( e ));
        }) ;
    },
  } // end of return
} // end of export

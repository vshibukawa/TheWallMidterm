"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // login
  router.put("/login", (req, res) => {
    console.log(req.body);
    knex
      .select("*")
      .from("users")
      .where(`username=${req.body.user.username}`)
      .then((err, results) => {

        if(err){ return res.status(400).json({ error: 'User not found'}); }

        const {id, username, password, avatar} = results;

        if(password === req.body.user.password){
        // if(bcrypt.compareSync( password, req.body.user.password)){
          req.session.user_id = id;
          return res.status(200).json({id, username, avatar});
        }

        return res.status(400).json({ error: 'Incorrect password'});
    });
  });

  // logout
  router.put('/logout', (req, res) => {
    req.session.user_id = '';
    return res.status(200);
  });

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}

"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/register", (req, res) => {
    const userDetailsArr = [{id: 4, first_name: 'DummyFirst', last_name: 'User' , username: 'testusername', email: 'email@email.com' , password: '123' }]
    knex('users')
      .insert(userDetailsArr)
      .then(() => console.log(`Person added. First Name: ${userDetailsArr[0]}, Last Name: ${userDetailsArr[1]}, username: ${userDetailsArr[2]}, password: ${userDetailsArr[4]}`))
      .catch((err) => { console.log(err); throw err })
      .finally(() => {
          knex.destroy();
      });        
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

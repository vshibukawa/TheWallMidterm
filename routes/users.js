"use strict";

const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");

function generateRandomString(num) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456879";
  for (let i = 0; i < num; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}



module.exports = (knex) => {

  router.post("/register", (req, res) => {
    let id = 0;
    const {first_name, last_name, username, email, password, avatar} = req.body;

    if (first_name === "" || last_name === "" || username === "" || email === "" || password === "" || avatar === "") {
      return res.status(400).send({ error: "Incomplete form submitted. Please check fields and try again." })
    }     
    if (password.length < 2) {
      return res.status(400).send({ error: "Password must be at least 8 characters long. Please enter new password and try again." })
    } 
    knex.select("*").from("users").where("username", username).orWhere("email", email)
    .then( (result) => {
      if (result.length === 0 ) {
        
        knex('users').max('id')
        .then((results) => {
          id = results[0].max + 1;        // User Max Number Incrementer, USED FOR DEVELOPMENT ONLY!!!
          
          const token = generateRandomString(6);
          // const hashedPassword = bcrypt.hashSync(password,10);
          
          const userDetailsArr = [{id: id, first_name: first_name, last_name: last_name , username: username, email: email , password: password, avatar: avatar, token: token }]
          
          knex('users')
          .insert(userDetailsArr)
          .then(() => {
            req.session.user_id = token; // Currently not posting out to browser cookies
            return res.status(200).send({id, first_name, last_name, username, email, avatar});
          })
          .catch((err) => { console.log(err); throw err });
        });
      } else {
        if (result[0].username == username) {
          return res.status(400).send({ error: "Username already taken. Please enter new username and try again." })
        }
        if (result[0].email == email) {
          return res.status(400).send({ error: "Email already taken. Please enter new email and try again." })
        }
        return res.status(400).send({ error: `Bad Request: ${req}` })
      }

    });          
  });       
  // login
  router.put("/login", (req, res) => {
    const {username, password} = req.body;
    knex
      .select("*")
      .from("users")
      .where('username', username)
      .then((foundUser) => {        
        if(foundUser.length === 0){ return res.status(400).send({ error: "Username not found. Please enter valid username."}); }

        if(password === foundUser[0].password){
        // if(bcrypt.compareSync( password, req.body.user.password)){
          knex("users")
            .where('username', username)
            .update("token", generateRandomString(6), ['id', 'token'])            
            .then((result) => {
              req.session.user_id = result[0].token;
              console.log(req.session.user_id);
              return res.status(200).send("Login Successful.");
            });
        } else {
          return res.status(400).send({ error: "Incorrect password. Please try again."});
        }

    });
  });

  // logout
  router.post("/logout", (req, res) => {
     knex("users")
     .where("token", req.session.user_id)      
     .update("token", "", ["username", "token"])
     .then((result) => {
       req.session = null;
       return res.status(200).send("Logout Successful.");
      })
      .catch((err) => {
        return res.status(400).send({ error: "Logout Failed."})
      });
  });

  // get user's categories

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

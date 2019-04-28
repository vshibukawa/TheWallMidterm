"use strict";

const express = require('express');
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
  const helpers = require('../helpers/index')(knex);

  return{

    register: (req, res) => {
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
            const hashedPassword = bcrypt.hashSync(password,10);

            const userDetailsArr = [{id: id, first_name: first_name, last_name: last_name , username: username, email: email , password: hashedPassword, avatar: avatar, token: token }]

            knex('users')
            .insert(userDetailsArr)
            .then(() => {
              req.session.user_id = token; // Currently not posting out to browser cookies
              return res.status(200).send({id, first_name, last_name, username, email, avatar, token});
            })
            .catch((err) => { throw err });
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
    },

    login: (req, res) => {
      const {username, password} = req.body;
      knex
        .select("*")
        .from("users")
        .where('username', username)
        .then((foundUser) => {
          if(foundUser.length === 0){ return res.status(400).send({ error: "Username not found. Please enter valid username."}); }

          // if(password === foundUser[0].password){
          if(bcrypt.compareSync( password, foundUser[0].password)){
            knex("users")
              .where('username', username)
              .update("token", generateRandomString(6), ['id', 'token'])
              .then((result) => {
                req.session.user_id = result[0].token;
                const currentUser = {
                  token: result[0].token,
                  avatar: foundUser[0].avatar
                }
                return res.status(200).send({currentUser, info: "Login Successful."});
              });
          } else {
            return res.status(400).send({ error: "Incorrect password. Please try again."});
          }

      });
    },

    logout: (req, res) => {
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
    },

    getUser: (req, res) => {
      knex
        .select("*")
        .from("users")
        .where("token", req.params.userToken)
        .limit(1)
        .then( result => {
          const { id, first_name, last_name, username, email, avatar, token } = result[0];
          return res.status(200).send({ id, first_name, last_name, username, email, avatar, token });
        })
        .catch((err) => {
          return res.status(400).send({ error: "Cannot find user."})
        });
    },

    updateUser: (req, res) => {

      const {first_name, last_name, username, email, password, avatar} = req.body
      if (first_name === "" || last_name === "" || username === "" || email === "" || password === "" || avatar === "") {
        return res.status(400).send({ error: "Incomplete form submitted. Please check fields and try again." })
      }
      if (password.length < 2) {
        return res.status(400).send({ error: "Password must be at least 8 characters long. Please enter new password and try again." })
      }

      let changes = {};
      knex
        .select('*')
        .from('users')
        .where("token", req.params.userToken)
        .limit(1)
        .then((result) => {
          for (let field in req.body) {
            if (result[0][field] !== req.body[field]) {
              changes[field] = req.body[field];
              if(field === 'password'){ changes[field] = bcrypt.hashSync(req.body[field],10); }
            }
          }
          if (changes.length === 0) {
            return res.status(200).send('No Changes.')
          }

          if (changes.username || changes.email) {
            knex
              .select('*')
              .from('users')
              .whereNot("token", req.params.userToken)
              .andWhere("username", username).orWhere("email", email)
              .then( (result) => {

                if (result.length === 0 ) {
                  knex("users")
                    .where("token", req.params.userToken)
                    .update(changes,['id'])
                    .then((result) => {
                      return res.status(200).send(result);
                    });
                } else {
                  return res.status(400).send({ error: "Username Or Email already exists. Please try again." })
                  //errors
                } // end of else
              }) // end of then
            } else {
             knex("users")
               .where("token", req.params.userToken)
               .update(changes,['id'])
               .then((result) => {
                 return res.status(200).send(result);
               });
            }

        })
        .catch((err) => {
          return res.status(400).send({ error: "Cannot find user."})
        });
    }

  }
}

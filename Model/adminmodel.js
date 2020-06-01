var db = require('../databaseconnection');
var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');
const bcrypt = require('bcryptjs')
var generator = require('generate-password');

module.exports = {
    login: function (req, res, email, password, callback) {
        var checkStatus = true;
        //get user firstly by email
        db.query("select * from systemadmin where email = \'" + email + "\'", function (err, result, field) {
            if (err) throw err;
            else if (result.length == 0) {
                checkStatus = false;
            }
            if (checkStatus) 
            {
                //compare given password from req with the hashed password saved in database
                bcrypt.compare(password, result[0].password)
                    .then(match => {
                        if (!match) {
                            checkStatus = false
                        }
                        else { //Add admin username and email to the session
                            // req.session.username = result[0].name;
                            // req.session.email = result[0].email;
                            // console.log(req.session.username)
                        }
                    })

            }
            callback(req, res, checkStatus);

        });
    },
    getAllSystemAdmins: function (req, res, callback) {
        // console.log(req.session.username)
        db.query("select * from systemadmin", function (err, result, field) {
            if (err) throw err;
            callback(req, res, result);
        });
    },
    insertnewSystemAdmin: function (req, res, callback) {
        var name = req.query.name;
        var email = req.query.email;
        //generates password for the new admin
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        console.log(password)
        //hash password before saving it in database
        bcrypt.hash(password, 12)
            .then(hashedpassword => {
                db.query("INSERT INTO systemadmin (name,email,password) VALUES ('" + name + "','" + email + "','" + hashedpassword + "')", function (err, result, field) {
                    if (err) throw err;
                    callback(req, res, result);
                })
            })

    },
    deleteSystemAdmin: function (req, res, callback) {
        var id = req.query.adminid;
        console.log(id)
        db.query("DELETE FROM systemadmin where systemAdminId = '" + id + "'", function (err, result, field) {
            if (err) throw err;
            callback(req, res, result);
        })
    },






}


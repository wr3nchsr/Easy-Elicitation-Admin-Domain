var db = require('../databaseconnection');
var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');
const bcrypt = require('bcryptjs')
var generator = require('generate-password');
const nodemailer = require("nodemailer");
var sendemail = require('../sendmail')
const crypto = require('crypto')


module.exports = {
    login: function (req, res, callback) {
        var checkStatus = true;
        //get user firstly by email
        db.query("select * from systemadmin where email = \'" + req.body.email + "\'", function (err, result, field) {
            if (err) throw err;
            else if (result.length == 0) {
                res.send("Invalid email or password")
                checkStatus = false;
                // callback(req, res, false);
            }
            if (checkStatus) {
                //compare given password from req with the hashed password saved in database
                bcrypt.compare(req.body.password, result[0].password)
                    .then(match => {
                        if (!match) {
                            res.send("Invalid email or password")
                            // console.log("wrong password")
                            // checkStatus = false
                            // callback(req, res, false);
                        }
                        else { //Add admin name and email to the session
                            req.session.name = result[0].name;
                            req.session.email = result[0].email;
                            req.session.id = result[0].systemAdminId;
                            //console.log(req.session.name)
                            req.session.save()
                            res.send("successfully loggedin")
                            //callback(req, res, true);
                        }
                    })

            }

        });
    },
    getAllSystemAdmins: function (req, res, callback) {
        console.log(req.session.name)
        console.log(req.session.email)
        db.query("select * from systemadmin", function (err, result, field) {
            if (err) throw err;
            callback(req, res, result);
        });
    },
    checkemailexistance: function (req, res) {
        db.query("select * from systemadmin where email = \'" + req.query.email + "\'", function (err, result, field) {
            if (err) throw err;
            if (result.length == 0)
                res.send("email doesn't exist")
            else {
                res.send("email already exists")
            }
        });
    },
    insertnewSystemAdmin: function (req, res, callback) {
        var name = req.body.name;
        var email = req.body.email;
        //generates password for the new admin
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        console.log(password)
        //hash password before saving it in database
        bcrypt.hash(password, 12)
            .then(hashedpassword => {
                db.query("INSERT INTO systemadmin (name,email,password) VALUES ('" + name + "','" + email
                    + "','" + hashedpassword + "')", function (err, result, field) {
                        if (err) throw err;
                        var emailtext = "A new Account was created for you as a System admin \n your usename is:"
                            + name + "\n your password is: " + password + "\n You can change the password anytime from your account \n"
                        sendemail.sendToNewAdmin(email, "Easy Elicitation System admin Account", emailtext)
                        callback(req, res, result);
                    })
            })
    },
    deleteSystemAdmin: function (req, res, callback) {
        var id = req.query.adminid;
        console.log(id)
        db.query("DELETE FROM systemadmin where systemAdminId = '" + id
            + "'", function (err, result, field) {
                if (err) throw err;
                callback(req, res, result);
            })
    },
    editpassword: function (req, res) {
        db.query("select * from systemadmin where email = \'" + req.session.email
            + "\'", function (err, result, field) {
                if (err) throw err;
                else if (result.length == 0) {
                    res.send("user not found")
                }
                //compare given password from req with the hashed password saved in database
                bcrypt.compare(req.body.oldpassword, result[0].password)
                    .then(match => {
                        if (!match) {
                            res.send("wrong old password")
                        }
                        else {
                            bcrypt.hash(req.body.newpassword, 12)
                                .then(hashedpassword => {
                                    db.query("update systemadmin set password = \'"
                                        + hashedpassword + "\' where email = \'" + req.session.email +
                                        "\'", function (err, result, field) {
                                            if (err) throw err
                                            res.send("ok")
                                        })
                                })

                        }
                    })
            });
    },
    resetpassword: function (req, res) {
        var newpassword = req.body.password
        console.log(newpassword)
        var email = req.body.email
        var token = req.body.token
        console.log(token)
        db.query("select * from systemadmin where email = \'" + email + "\' and resetPasswordToken = \'" + token + "\'", function (err, result, field) {
            if (err) throw err
            else {
                console.log("bye")
                var expireToken = result[0].expireToken;
                if (parseInt(expireToken) >= parseInt(Date.now().toString())) {
                    console.log("hii")
                    bcrypt.hash(newpassword, 12)
                        .then(hashedpassword => {
                            db.query("update systemadmin set password = \'"
                                + hashedpassword + "\',resetPasswordToken = null , expireToken = null where email = \'" + email +
                                "\'", function (err, result, field) {
                                    if (err) throw err
                                    res.send("password reset")
                                })
                        })
                }
            }
        })




    },
    forgetpassword: function (req, res) {
        db.query("select * from systemadmin where email = \'" + req.query.email + "\'", function (err, result, field) {
            if (err) throw err;
            else if (result.length == 0) {
                res.send("user not found")
            }
            else {
                crypto.randomBytes(32, (err, buffer) => {
                    if (err) console.log(err)
                    else {
                        const token = buffer.toString("hex")
                        console.log(token)
                        var email = req.query.email
                        var expireToken = Date.now() + 3600000
                        db.query("update systemadmin set resetPasswordToken = \'"
                            + token + "\',expireToken = \'" + expireToken + "\' where email = \'" + email +
                            "\'", function (err, result, field) {
                                if (err) throw err
                                else {
                                    console.log("send email")
                                    var emailsubject = "please reset your password"
                                    var emailtext = "Please use the following link to reset your password \n"
                                        + "http://localhost:8081/resetpassword/" + token + "?email=" + email
                                    sendemail.sendToNewAdmin(email, emailsubject, emailtext)
                                    res.send("please check your email to reset password")
                                }
                            })

                    }
                });
            }
        });
    }
}


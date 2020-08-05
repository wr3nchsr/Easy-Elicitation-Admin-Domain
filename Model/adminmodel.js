var db = require('../databaseconnection');
var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');
const bcrypt = require('bcryptjs')
var generator = require('generate-password');
const nodemailer = require("nodemailer");
var sendemail = require('../sendmail');
const crypto = require('crypto');
const util = require('util');
const query = util.promisify(db.query).bind(db);

module.exports = {
    getSystemAdminByEmail: async function (email) {
        let sql = "SELECT * FROM systemadmin WHERE email = ? ";
        let inserts = [email]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        if (output.length === 1)
            return output[0];
        return null;
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
    insertnewSystemAdmin: async function (name, email, hashedpassword) {
        db.query("INSERT INTO systemadmin (name,email,password) VALUES ('" + name + "','" + email
            + "','" + hashedpassword + "')", function (err, result, field) {
                if (err) throw err;
                return result;
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


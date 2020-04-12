var db = require('../databaseconnection');
var express = require('express');
var path = require('path');
var app = express();

module.exports = {
    login: function (req,res,email, password,callback) {
        var checkStatus=true;
        db.query("select * from systemadmin where Email = \'" + email + "\' and password = \'" + password + "\'", function (err, result, field) {
            if (err) throw err;
            else if (result.length == 0) {
                checkStatus=false;
            }
            if(checkStatus) //Add admin user name to the session
            {
                req.session.username = result[0].username;
                req.session.email = result[0].email;
            }
            callback(req,res,checkStatus);

        });
    },
    getAllSystemAdmins: function(req,res,callback){
        db.query("select * from systemadmin",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        });
    },
    insertnewSystemAdmin:function(req,res,callback)
    {
        var name=req.query.name;
        var email=req.query.email;
        var password=req.query.password;
        db.query("INSERT INTO systemadmin (name,Email,password) VALUES ('"+name+"','"+email+"','"+password+"')",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        })
    },
    
    
    



}


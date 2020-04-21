var db = require('../databaseconnection');
var express = require('express');
var path = require('path');
var app = express();

module.exports = {

    getAllCompanyAdmins: function(req,res,callback){
        db.query("select * from companyadmin",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        });
    },
    insertnewCompanyAdmin:function(req,res,callback)
    {
        var name=req.query.name;
        var email=req.query.email;
        var password=req.query.password;
        db.query("INSERT INTO companyadmin (name,Email,password) VALUES ('"+name+"','"+email+"','"+password+"')",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        })
    },
    deleteCompanyAdmin:function(req,res,callback)
    {
        var name=req.query.name;
        db.query("DELETE FROM companyadmin where VALUES name = \'"+name+ "\' ",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        })
    },
    

}
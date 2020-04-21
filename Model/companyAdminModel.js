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
        var companyname=req.query.companyname;
        db.query("INSERT INTO companyadmin (name,companyname,Email,password) VALUES ('"+name+"','"+companyname+"','"+email+"','"+password+"')",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        })
    },
    deleteCompanyAdmin:function(req,res,callback)
    {
        var id=req.query.adminid;
        db.query("DELETE FROM companyadmin where AdminId = \'"+id+ "\' ",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        })
    },
    

}
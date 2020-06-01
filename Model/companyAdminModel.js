var db = require('../databaseconnection');
var express = require('express');
var path = require('path');
var app = express();
const bcrypt = require('bcryptjs')
var generator = require('generate-password');

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
        //var password=req.query.password;
        //generate password for new company admin
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        var companyname=req.query.companyname;
        bcrypt.hash(password, 12)
        .then(hashedpassword=>{
            db.query("INSERT INTO companyadmin (name,companyName,email,password) VALUES ('"+name+"','"+companyname+"','"+email+"','"+hashedpassword+"')",function(err,result,field){
                if(err) throw err;
                callback(req,res,result);
            })
        })
        
    },
    deleteCompanyAdmin:function(req,res,callback)
    {
        var id=req.query.adminid;
        db.query("DELETE FROM companyadmin where companyAdminId = \'"+id+ "\' ",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        })
    },
    

}
var db = require('../databaseconnection');
var express = require('express');
var path = require('path');
var app = express();
const bcrypt = require('bcryptjs')
var generator = require('generate-password');
var sendemail = require('../sendmail')

module.exports = {

    getAllCompanyAdmins: function(req,res,callback){
        db.query("select * from companyadmin",function(err,result,field){
            if(err) throw err;
            callback(req,res,result);
        });
    },
    insertnewCompanyAdmin:function(req,res,callback)
    {
        var name=req.body.name;
        var email=req.body.email;
        //var password=req.query.password;
        //generate password for new company admin
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        var companyname=req.body.companyname;
        bcrypt.hash(password, 12)
        .then(hashedpassword=>{
            db.query("INSERT INTO companyadmin (name,companyName,email,password) VALUES ('"+name+"','"+companyname+"','"+email+"','"+hashedpassword+"')",function(err,result,field){
                if(err) throw err;
                var emailtext = "A new Account was created for you as a Company admin for your company "+companyname+" \n your usename is:"+name+"\n your password is: " + password + "\n You can change the password anytime from your account \n"
                sendemail.sendToNewAdmin(email,"Easy Elicitation Company admin Account",emailtext)
                callback(req,res,result);
            })
        })
        
    },
    checkemailexistance: function(req,res){
        db.query("select * from companyadmin where email = \'"+req.query.email+"\'", function (err, result, field) {
            if (err) throw err;
            if(result.length==0)
                res.send("email doesn't exist")
            else{
                res.send("email already exists")
            }
        });
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
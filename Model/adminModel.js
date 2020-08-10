var db = require('../databaseconnection');
const util = require('util');
const query = util.promisify(db.query).bind(db);

module.exports = {
    getSystemAdminByEmail: async function (email) {
        let sql = "SELECT * FROM systemadmin WHERE email = ? ";
        let inserts = [email]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;
    },
    getAllSystemAdmins: async function () {
        let sql = "SELECT * FROM systemadmin"
        sql = db.format(sql);
        const output = await query(sql);
        return output;

    },
    insertnewSystemAdmin: async function (name, email, hashedpassword) {
        let sql = "INSERT INTO systemadmin (name,email,password) VALUES (?,?,?)";
        let inserts = [name,email,hashedpassword]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;
    },
    deleteSystemAdmin: async function (id) {
        let sql = "DELETE FROM systemadmin where systemAdminId = ? ";
        let inserts = [id]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;
    },
    updatePassword: async function (hashedpassword, email) {
        let sql = "update systemadmin set password = ? where email = ? "
        let inserts = [hashedpassword, email]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;
    },
    resetpassword: async function (email, token) {
        let sql = "SELECT * FROM systemadmin WHERE email = ? and resetPasswordToken = ? ";
        let inserts = [email, token]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;
    },
 
    forgetpassword: async function (token,expireToken,email)
    {
        let sql = "update systemadmin set resetPasswordToken = ? ,expireToken = ? where email = ? ";
        let inserts = [token, expireToken,email]
        sql = db.format(sql, inserts);
        const output = await query(sql);
        return output;
    }


}


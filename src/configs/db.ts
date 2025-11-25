import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();



 const db = mysql.createPool({
    host: process.env.rdsqlHostlink,
    user: process.env.rdsusername,
    password: process.env.rdspassword,
    database: process.env.rdsdatabase
})
export default db;  
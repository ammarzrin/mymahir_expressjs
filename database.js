require('dotenv').config();
const mysql = require('mysql2/promise');

const database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

(async () => { 
    try {
        const connection = await database.getConnection();
        console.log('Database connected successfully.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();

module.exports = database;
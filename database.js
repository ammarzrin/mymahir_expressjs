require('dotenv').config();
const mysql = require('mysql2/promise');

const database = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'mymahirnov',
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
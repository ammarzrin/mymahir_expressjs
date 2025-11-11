const mysql = require('mysql2/promise');

const database = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Marzrin22',
    database: 'mymahirnov',
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
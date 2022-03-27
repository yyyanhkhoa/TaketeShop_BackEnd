const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'DA1_TaketeShop',
})

async function connectSQL() {
    try {
        await connection.connect()
        console.log("SQL database connected")
    }catch (e) {
        console.log("SQL connect failed")
        console.log("Error is: " + e)
    }
}


module.exports = { connectSQL, connection }
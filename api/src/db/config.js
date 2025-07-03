const dotenv = require("dotenv")
const knex = require("knex")

dotenv.config({ path: __dirname + "/.env" });

const db = knex({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        timezone: "+00:00"
    }
})

module.exports = db
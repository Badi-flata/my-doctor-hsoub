const { Sequelize } = require('sequelize')

const db = new Sequelize(
    process.env.DB_NAME || 'mydoctor',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'badipg',
    {   
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
)

db.authenticate().then(() => {
    console.log('Database connected successfully')
}).catch((err) => {
    console.error('Database connection failed:', err.message)
})

module.exports = db;
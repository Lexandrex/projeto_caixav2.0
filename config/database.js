import { Sequelize } from "sequelize";

const db = new Sequelize('caixateste', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db
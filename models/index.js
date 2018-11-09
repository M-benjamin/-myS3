import Sequelize from 'sequelize'
import User from './user'
import dotenv from 'dotenv'
// const url = 'postgres://efrei-paris:@localhost:5432/express.island.dev';

dotenv.config()

export const db = new Sequelize(process.env.DATABSE_URL);
console.log(process.env.DATABSE_URL)

User.init(db, Sequelize);
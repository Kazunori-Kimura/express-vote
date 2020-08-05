import { Sequelize } from 'sequelize';
import { resolve } from 'path';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: resolve(process.cwd(), 'database/database.sqlite'),
});

export default sequelize;

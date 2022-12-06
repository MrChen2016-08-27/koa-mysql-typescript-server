import { Sequelize } from "sequelize";
import { createNamespace } from "cls-hooked";
Sequelize.useCLS(createNamespace("sequelize-transaction-namespace"));
import config from "../config/index";

export default new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password,
    {
        host: config.mysql.host,
        dialect: "mysql",
        port: config.mysql.port,
        pool: config.mysql.pool,
        logging: config.mysql.logging,
        // 是否将undefined转化为NULL
        // - 默认: false
        omitNull: true,
    }
);

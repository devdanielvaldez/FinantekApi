"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_SOURCES = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.DATA_SOURCES = {
    mySqlDataSource: {
        DB_HOST: process.env.MY_SQL_DB_HOST,
        DB_USER: process.env.MY_SQL_DB_USER,
        DB_PASSWORD: process.env.MY_SQL_DB_PASSWORD,
        DB_PORT: process.env.MY_SQL_DB_PORT,
        DB_DATABASE: process.env.MY_SQL_DB_DATABASE,
        DB_CONNECTION_LIMIT: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 100,
    }
};

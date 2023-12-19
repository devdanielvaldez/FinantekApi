"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_SOURCES = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.DATA_SOURCES = {
    mySqlDataSource: {
        DB_HOST: process.env.MY_SQL_DB_HOST || "finantek-dev-api-do-user-15293740-0.c.db.ondigitalocean.com",
        DB_USER: process.env.MY_SQL_DB_USER || "dev",
        DB_PASSWORD: process.env.MY_SQL_DB_PASSWORD || "AVNS_1GCHLZawTjjpEwKiUdX",
        DB_PORT: process.env.MY_SQL_DB_PORT || '25060',
        DB_DATABASE: process.env.MY_SQL_DB_DATABASE || 'finantek',
        DB_CONNECTION_LIMIT: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 100,
    }
};

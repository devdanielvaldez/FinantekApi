"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.init = void 0;
const promise_1 = require("mysql2/promise");
const vars_confing_1 = require("../../config/vars.confing");
const dataSource = vars_confing_1.DATA_SOURCES.mySqlDataSource;
let pool = null;
const initializePool = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        pool = yield (0, promise_1.createPool)({
            connectionLimit: 10,
            host: "finantek-dev.cnp5ruig78hz.us-east-1.rds.amazonaws.com",
            user: "dev",
            password: "Prueba01*",
            database: "finantek",
            port: Number(dataSource.DB_PORT)
        });
        console.debug('MySQL Adapter Pool generated successfully');
    }
    catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        throw new Error('Failed to initialize pool');
    }
});
// @ts-ignore
const executeQuery = (query, params, retries = 3) => __awaiter(void 0, void 0, void 0, function* () {
    if (!pool) {
        yield initializePool();
    }
    try {
        if (pool) {
            yield pool.beginTransaction();
            const [results] = yield pool.execute(query, params);
            return results;
        }
        else {
            throw new Error('Pool is not initialized');
        }
    }
    catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error, query, params);
        // @ts-ignore
        if (retries > 0 && (error === null || error === void 0 ? void 0 : error.code) === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Attempting to reconnect...');
            pool = null; // Reset pool to force reconnection
            yield initializePool();
            return executeQuery(query, params, retries - 1);
        }
        throw new Error('Failed to execute MySQL query');
    }
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initializePool();
});
exports.init = init;
const execute = (query, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield executeQuery(query, params);
    }
    catch (error) {
        throw error;
    }
});
exports.execute = execute;

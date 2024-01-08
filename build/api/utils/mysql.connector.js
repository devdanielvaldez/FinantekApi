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
let pool;
/**
 * generates pool connection to be used throughout the app
 */
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        pool = yield (0, promise_1.createConnection)({
            connectionLimit: 10,
            host: dataSource.DB_HOST,
            user: dataSource.DB_USER,
            password: dataSource.DB_PASSWORD,
            database: dataSource.DB_DATABASE,
            port: Number(dataSource.DB_PORT)
        });
        console.debug('MySql Adapter Pool generated successfully');
    }
    catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        throw new Error('failed to initialized pool');
    }
});
exports.init = init;
/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
const execute = (query, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (!pool) {
        yield (0, exports.init)();
    }
    try {
        yield pool.beginTransaction();
        const [results] = yield pool.execute(query, params);
        return results;
    }
    catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error, query, params);
        throw new Error('failed to execute MySQL query');
    }
});
exports.execute = execute;

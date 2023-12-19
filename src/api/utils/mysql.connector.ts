import { createPool, Pool, createConnection} from 'mysql2/promise';
import { DATA_SOURCES } from '../../config/vars.confing';

const dataSource = DATA_SOURCES.mySqlDataSource;

let pool: any;

/**
 * generates pool connection to be used throughout the app
 */
export const init = async () => {
  try {
    pool = await createConnection({
      connectionLimit: DATA_SOURCES.mySqlDataSource.DB_CONNECTION_LIMIT,
      host: DATA_SOURCES.mySqlDataSource.DB_HOST,
      user: DATA_SOURCES.mySqlDataSource.DB_USER,
      password: DATA_SOURCES.mySqlDataSource.DB_PASSWORD,
      database: DATA_SOURCES.mySqlDataSource.DB_DATABASE,
      port: +DATA_SOURCES.mySqlDataSource.DB_PORT
    });

    console.debug('MySql Adapter Pool generated successfully');
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error);
    throw new Error('failed to initialized pool');
  }
};

/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
export const execute = async (query: string, params?: string[] | Object) => {
  try {
    await pool.beginTransaction();
    const [results] = await pool.execute(query, params);
    // await pool.commit();
    return results;

  } catch (error) {
    // await pool.rollback();
    console.error('[mysql.connector][execute][Error]: ', error, query, params);
    throw new Error('failed to execute MySQL query');
  }
}
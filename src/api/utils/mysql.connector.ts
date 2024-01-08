import { createPool, Pool, createConnection } from 'mysql2/promise';
import { DATA_SOURCES } from '../../config/vars.confing';

const dataSource = DATA_SOURCES.mySqlDataSource;

let pool: Pool | null = null;

const initializePool = async () => {
  try {
    pool = await createPool({
      connectionLimit: 10,
      host: "finantek-dev.cnp5ruig78hz.us-east-1.rds.amazonaws.com",
      user: "dev",
      password: "Prueba01*",
      database: "finantek",
      port: Number(dataSource.DB_PORT)
    });

    console.debug('MySQL Adapter Pool generated successfully');
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error);
    throw new Error('Failed to initialize pool');
  }
};

// @ts-ignore
const executeQuery = async (query: string, params?: string[] | Object, retries = 3) => {
  if (!pool) {
    await initializePool();
  }

  try {
    if (pool) {
      // await pool.beginTransaction();
      const [results] = await pool.execute(query, params);
      return results;
    } else {
      throw new Error('Pool is not initialized');
    }
  } catch (error) {
    console.error('[mysql.connector][execute][Error]: ', error, query, params);
    // @ts-ignore
    if (retries > 0 && error?.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Attempting to reconnect...');
      pool = null; // Reset pool to force reconnection
      await initializePool();
      return executeQuery(query, params, retries - 1);
    }
    throw new Error('Failed to execute MySQL query');
  }
};

export const init = async () => {
  await initializePool();
};

export const execute = async (query: string, params?: string[] | Object) => {
  try {
    return await executeQuery(query, params);
  } catch (error) {
    throw error;
  }
};

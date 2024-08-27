import mariadb from 'mariadb';
import env from "dotenv";
env.config({ path: "../shared/connectionMariaDB/.env" });

let pool = null;

async function getConnection() {
    try {
        if (!pool) {
            pool = mariadb.createPool({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_DATABASE,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
                connectionLimit: 6
            });
        }
        const connection = await pool.getConnection();
        return {
            connection,
            release: () => {
                if (connection) connection.release();
            }
        };
    }
    catch (err) {
        throw err;
    }
};

export { getConnection }

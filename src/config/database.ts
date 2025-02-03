import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2.createPool({
	host: process.env.JAWSDB_URL.HOST,
	user: process.env.JAWSDB_URL.USER,
	password: process.env.JAWSDB_URL.PASSWORD,
	database: process.env.JAWSDB_URL.DATABASE,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export { pool };

import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
import url from "url";

dotenv.config();

// Parse the JAWSDB_URL from Heroku's config vars
const dbUrl = new url.URL(process.env.JAWSDB_URL);

const pool = mysql2.createPool({
    host: dbUrl.hostname,        // Hostname from the parsed URL
    user: dbUrl.username,        // Username from the parsed URL
    password: dbUrl.password,    // Password from the parsed URL
    database: dbUrl.pathname.slice(1),  // Remove the leading "/" from the database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export { pool };

import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
import url from "url";  // Import URL module to parse the JAWSDB_URL

dotenv.config();

// Ensure the JAWSDB_URL exists in the environment
const jawsDbUrl = process.env.JAWSDB_URL;
if (!jawsDbUrl) {
    throw new Error('JAWSDB_URL environment variable is not set.');
}

// Parse the JAWSDB_URL to extract connection details
const dbUrl = new url.URL(jawsDbUrl);

const pool = mysql2.createPool({
    host: dbUrl.hostname,        // Hostname from the parsed URL
    user: dbUrl.username,        // Username from the parsed URL
    password: dbUrl.password,    // Password from the parsed URL
    database: dbUrl.pathname.slice(1), // Database name, removing the leading "/"
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export { pool };

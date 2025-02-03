import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
import url from "url"; 

dotenv.config();

const jawsDbUrl = process.env.JAWSDB_URL;
if (!jawsDbUrl) {
    throw new Error('JAWSDB_URL environment variable is not set.');
}

// Parse the JAWSDB_URL to extract connection details
const dbUrl = new url.URL(jawsDbUrl);

// Log the URL parts for debugging purposes
console.log('DB URL:', dbUrl);
console.log('Host:', dbUrl.hostname);
console.log('User:', dbUrl.username);
console.log('Password:', dbUrl.password);
console.log('Database:', dbUrl.pathname.slice(1));

const pool = mysql2.createPool({
	host: dbUrl.hostname,        // Hostname from the parsed URL
    user: dbUrl.username,        // Username from the parsed URL
    password: dbUrl.password,    // Password from the parsed URL
    database: dbUrl.pathname.slice(1),
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export { pool };

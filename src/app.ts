import url from 'url';
import http from 'http';
import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import * as session from 'express-session';
import expressMysqlSession from 'express-mysql-session';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Check if JAWSDB_URL is set, and handle it accordingly
const jawsDbUrl = process.env.JAWSDB_URL;

if (!jawsDbUrl) {
    throw new Error('JAWSDB_URL environment variable is not set.');
}

// Parse the JAWSDB_URL from Heroku's config vars
const dbUrl = new url.URL(jawsDbUrl);

const MySQLStore = expressMysqlSession(session);
const sessionStore = new MySQLStore({
    host: dbUrl.hostname,         // Hostname from the parsed URL
    user: dbUrl.username,         // Username from the parsed URL
    password: dbUrl.password,     // Password from the parsed URL
    database: dbUrl.pathname.slice(1),  // Database name, removing the leading "/"
    clearExpired: true,
    expiration: 60 * 60000,
    createDatabaseTable: true,
    endConnectionOnClose: true,
    disableTouch: true,
    charset: 'utf8mb4',
    schema: {
        tableName: 'user_session',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data',
        },
    },
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 10,
});

app.use(
    session.default({
        secret: process.env.SESSION_SECRET || 'session-secret',
        resave: true,
        saveUninitialized: false,
        store: sessionStore,
        rolling: true,
        cookie: {
            maxAge: 5 * 60 * 60 * 1000, // 5 hours
            httpOnly: true,
        },
    })
);

// Your routes and other configurations here...

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV;

httpServer.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} in ${ENVIRONMENT} Environment`);
});

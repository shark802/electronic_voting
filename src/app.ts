import http from "node:http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "node:path";
import * as session from "express-session";
import { socketIO } from "./middlewares/socketIO";
import { errorHandler } from "./middlewares/errorHandler";
import apiRoutes from "./api";
import webRoutes from "./web";
import expressMysqlSession from "express-mysql-session";
import upload from './config/multerConfig';
import url from 'url';

// register all files that listening on event emitter
import './events';

upload.none();

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

// Parse the JAWSDB_URL from Heroku's config vars
const dbUrl = new url.URL(process.env.JAWSDB_URL);

// Create the session store with JawsDB MySQL credentials
const MySQLStore = expressMysqlSession(session);
const sessionStore = new MySQLStore({
    host: dbUrl.hostname,      // Hostname from the parsed URL
    user: dbUrl.username,      // Username from the parsed URL
    password: dbUrl.password,  // Password from the parsed URL
    database: dbUrl.pathname.slice(1),  // Remove the leading "/" from the database name
    clearExpired: true,
    expiration: 60 * 60000,  // Session expiration time
    createDatabaseTable: true,
    endConnectionOnClose: true,
    disableTouch: true,
    charset: "utf8mb4",
    schema: {
        tableName: "user_session",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data",
        },
    },
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 10,
});

// Initialize session middleware
app.use(
    session.default({
        secret: process.env.SESSION_SECRET || "session-secret",
        resave: true,
        saveUninitialized: false,
        store: sessionStore,
        rolling: true,
        cookie: {
            // secure: process.env.NODE_ENV === "production", // Uncomment for HTTPS
            maxAge: 5 * 60 * 60 * 1000, // 5 hours
            httpOnly: true,
        },
    })
);

/* Custom Middlewares */
app.use(socketIO(io));

/* Routers/Endpoints */
app.use("/api", apiRoutes);
app.use("/", webRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV;

httpServer.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} in ${ENVIRONMENT} Environment`);
});

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

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

const MySQLStore = expressMysqlSession(session);
const sessionStore = new MySQLStore({
	host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    clearExpired: true,
    expiration: 15 * 60000,
    createDatabaseTable: true,
    endConnectionOnClose: true,
    disableTouch: true,
    charset: "charset",
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

app.use(
	session.default({
		secret: process.env.SESSION_SECRET || "session-secret",
		resave: true,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 15 * 60000,
			httpOnly: true,
		},
	})
);

app.set("socket", io);

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

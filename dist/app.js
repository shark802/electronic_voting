"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
// Other imports remain unchanged
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
const session = __importStar(require("express-session"));
const socketIO_1 = require("./middlewares/socketIO");
const errorHandler_1 = require("./middlewares/errorHandler");
const api_1 = __importDefault(require("./api"));
const web_1 = __importDefault(require("./web"));
const express_mysql_session_1 = __importDefault(require("express-mysql-session"));
const multerConfig_1 = __importDefault(require("./config/multerConfig"));
require("./events");
multerConfig_1.default.none();
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = node_http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", node_path_1.default.join(__dirname, "../views"));
app.use(express_1.default.static(node_path_1.default.join(__dirname, "../public")));

// Parse JAWSDB_URL from Heroku config vars
const dbUrl = new URL(process.env.JAWSDB_URL);

// Log the URL parts for debugging purposes
console.log('DB URL:', dbUrl);
console.log('Host:', dbUrl.hostname);
console.log('User:', dbUrl.username);
console.log('Password:', dbUrl.password);
console.log('Database:', dbUrl.pathname.slice(1));

// MySQL session store using JawsDB details
const MySQLStore = (0, express_mysql_session_1.default)(session);
const sessionStore = new MySQLStore({
    host: dbUrl.hostname,        // Hostname from JAWSDB_URL
    user: dbUrl.username,        // Username from JAWSDB_URL
    password: dbUrl.password,    // Password from JAWSDB_URL
    database: dbUrl.pathname.slice(1),  // Database name from JAWSDB_URL (remove leading '/')
    port: 3306,                  // Default MySQL port
    clearExpired: true,
    expiration: 60 * 60000,      // Session expiration time
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
    ssl: { rejectUnauthorized: false },  // SSL config (if required by JawsDB)
});

app.use(session.default({
    secret: process.env.SESSION_SECRET || "session-secret",
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    rolling: true,
    cookie: {
        maxAge: 5 * 60 * 60 * 1000, // 5 hours
        httpOnly: true,
    },
}));

/* Custom Middlewares */
app.use((0, socketIO_1.socketIO)(io));

/* Routers/Endpoints */
app.use("/api", api_1.default);
app.use("/", web_1.default);
app.use(errorHandler_1.errorHandler);

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV;
httpServer.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} in ${ENVIRONMENT} Environment`);
});

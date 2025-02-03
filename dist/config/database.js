"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const url_1 = __importDefault(require("url"));

dotenv_1.default.config();

// Parse the JAWSDB_URL from Heroku's config vars
const dbUrl = new url_1.default.URL(process.env.JAWSDB_URL);

const pool = promise_1.default.createPool({
    host: dbUrl.hostname,      // Hostname from the parsed URL
    user: dbUrl.username,      // Username from the parsed URL
    password: dbUrl.password,  // Password from the parsed URL
    database: dbUrl.pathname.slice(1), // Remove the leading "/" from the database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: false }, // SSL configuration if required by JawsDB
});

exports.pool = pool;

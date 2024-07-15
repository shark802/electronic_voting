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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const passport_1 = __importDefault(require("passport"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = node_http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", node_path_1.default.join(__dirname, "../views"));
app.use(express_1.default.static(node_path_1.default.join(__dirname, "../public")));
const MySQLStore = (0, express_mysql_session_1.default)(session);
const sessionStore = new MySQLStore({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    clearExpired: true,
    expiration: 86400000,
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
app.use(session.default({
    secret: process.env.SESSION_SECRET || "session-secret",
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60000,
        httpOnly: true,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.set("socket", io);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQTZCO0FBQzdCLHNEQUE4QjtBQUM5Qix5Q0FBbUM7QUFDbkMsb0RBQTRCO0FBQzVCLDBEQUE2QjtBQUM3Qix5REFBMkM7QUFDM0MscURBQWtEO0FBQ2xELDZEQUEwRDtBQUMxRCxnREFBOEI7QUFDOUIsZ0RBQThCO0FBQzlCLGtGQUF3RDtBQUN4RCx3REFBZ0M7QUFFaEMsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQixNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUN0QixNQUFNLFVBQVUsR0FBRyxtQkFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQyxNQUFNLEVBQUUsR0FBRyxJQUFJLGtCQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsbUJBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbkQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTNELE1BQU0sVUFBVSxHQUFHLElBQUEsK0JBQW1CLEVBQUMsT0FBTyxDQUFDLENBQUM7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
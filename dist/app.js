"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
const express_session_1 = __importDefault(require("express-session"));
const socketIO_1 = require("./middlewares/socketIO");
const errorHandler_1 = require("./middlewares/errorHandler");
const api_1 = __importDefault(require("./api"));
const web_1 = __importDefault(require("./web"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = node_http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", node_path_1.default.join(__dirname, "../views"));
app.use(express_1.default.static(node_path_1.default.join(__dirname, "../public")));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60000,
        httpOnly: true,
    },
}));
app.set("socket", io);
/* Custom Middlewares */
app.use((0, socketIO_1.socketIO)(io));
/* Routers */
app.use("/api", api_1.default);
app.use("/", web_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV;
httpServer.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} in ${ENVIRONMENT} Environment`);
});

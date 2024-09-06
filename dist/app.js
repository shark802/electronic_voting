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
const multerConfig_1 = __importDefault(require("./config/multerConfig"));
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
const MySQLStore = (0, express_mysql_session_1.default)(session);
const sessionStore = new MySQLStore({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    clearExpired: true,
    expiration: 60 * 60000,
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
app.use(session.default({
    secret: process.env.SESSION_SECRET || "session-secret",
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60000,
        httpOnly: true,
    },
}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQTZCO0FBQzdCLHNEQUE4QjtBQUM5Qix5Q0FBbUM7QUFDbkMsb0RBQTRCO0FBQzVCLDBEQUE2QjtBQUM3Qix5REFBMkM7QUFDM0MscURBQWtEO0FBQ2xELDZEQUEwRDtBQUMxRCxnREFBOEI7QUFDOUIsZ0RBQThCO0FBQzlCLGtGQUF3RDtBQUN4RCx5RUFBMkM7QUFFM0Msc0JBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUVkLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7QUFDdEIsTUFBTSxVQUFVLEdBQUcsbUJBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxrQkFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWxDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hELEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLG1CQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25ELEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsbUJBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUzRCxNQUFNLFVBQVUsR0FBRyxJQUFBLCtCQUFtQixFQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELE1BQU0sWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDO0lBQ2hDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUk7SUFDdEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSTtJQUN0QixRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRO0lBQzlCLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVE7SUFDOUIsWUFBWSxFQUFFLElBQUk7SUFDbEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxLQUFLO0lBQ3RCLG1CQUFtQixFQUFFLElBQUk7SUFDekIsb0JBQW9CLEVBQUUsSUFBSTtJQUMxQixZQUFZLEVBQUUsSUFBSTtJQUNsQixPQUFPLEVBQUUsU0FBUztJQUNsQixNQUFNLEVBQUU7UUFDSixTQUFTLEVBQUUsY0FBYztRQUN6QixXQUFXLEVBQUU7WUFDVCxVQUFVLEVBQUUsWUFBWTtZQUN4QixPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsTUFBTTtTQUNmO0tBQ0o7SUFDRCxrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGVBQWUsRUFBRSxFQUFFO0lBQ25CLE9BQU8sRUFBRSxFQUFFO0lBQ1gsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLEVBQUU7Q0FDakIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEdBQUcsQ0FDSCxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ1osTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLGdCQUFnQjtJQUN0RCxNQUFNLEVBQUUsSUFBSTtJQUNaLGlCQUFpQixFQUFFLEtBQUs7SUFDeEIsS0FBSyxFQUFFLFlBQVk7SUFDbkIsTUFBTSxFQUFFO1FBQ0osTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVk7UUFDN0MsTUFBTSxFQUFFLEVBQUUsR0FBRyxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxJQUFJO0tBQ2pCO0NBQ0osQ0FBQyxDQUNMLENBQUM7QUFHRixHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUV0Qix3QkFBd0I7QUFDeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLG1CQUFRLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUV0Qix1QkFBdUI7QUFDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsYUFBUyxDQUFDLENBQUM7QUFDM0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsYUFBUyxDQUFDLENBQUM7QUFFeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQywyQkFBWSxDQUFDLENBQUM7QUFFdEIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0FBQ3RDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBRXpDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixJQUFJLE9BQU8sV0FBVyxjQUFjLENBQUMsQ0FBQztBQUNoRixDQUFDLENBQUMsQ0FBQyJ9
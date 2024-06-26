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
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV;
httpServer.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} in ${ENVIRONMENT} Environment`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBEQUE2QjtBQUM3QixzREFBOEI7QUFDOUIseUNBQW1DO0FBQ25DLG9EQUE0QjtBQUM1QiwwREFBNkI7QUFDN0Isc0VBQXNDO0FBQ3RDLHFEQUFrRDtBQUNsRCw2REFBMEQ7QUFDMUQsZ0RBQThCO0FBRTlCLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7QUFDdEIsTUFBTSxVQUFVLEdBQUcsbUJBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxrQkFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWxDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLG1CQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25ELEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsbUJBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUzRCxHQUFHLENBQUMsR0FBRyxDQUNOLElBQUEseUJBQU8sRUFBQztJQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsSUFBSSxnQkFBZ0I7SUFDdEQsTUFBTSxFQUFFLEtBQUs7SUFDYixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLE1BQU0sRUFBRTtRQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZO1FBQzdDLE1BQU0sRUFBRSxFQUFFLEdBQUcsS0FBSztRQUNsQixRQUFRLEVBQUUsSUFBSTtLQUNkO0NBQ0QsQ0FBQyxDQUNGLENBQUM7QUFFRixHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUV0Qix3QkFBd0I7QUFDeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLG1CQUFRLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUV0QixhQUFhO0FBQ2IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsYUFBUyxDQUFDLENBQUM7QUFFM0IsR0FBRyxDQUFDLEdBQUcsQ0FBQywyQkFBWSxDQUFDLENBQUM7QUFFdEIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0FBQ3RDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBRXpDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixJQUFJLE9BQU8sV0FBVyxjQUFjLENBQUMsQ0FBQztBQUM3RSxDQUFDLENBQUMsQ0FBQyJ9
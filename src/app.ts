import http from "node:http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "node:path";
import session from "express-session";
import { socketIO } from "./middlewares/socketIO";
import { errorHandler } from "./middlewares/errorHandler";
import apiRoutes from "./api";

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

app.use(
	session({
		secret: process.env.SESSION_SECRET || "session-secret",
		resave: false,
		saveUninitialized: false,
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

/* Routers */
app.use("/api", apiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV;

httpServer.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT} in ${ENVIRONMENT} Environment`);
});

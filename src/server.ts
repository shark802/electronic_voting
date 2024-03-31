import app from "./app";
import http from "node:http";
import dotenv from "dotenv";

dotenv.config();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const node_http_1 = __importDefault(require("node:http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const httpServer = node_http_1.default.createServer(app_1.default);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { pathToFileURL } from "node:url";

dotenv.config();
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

export default app;

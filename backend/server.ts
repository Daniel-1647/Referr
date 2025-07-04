import dotenv from "dotenv";
dotenv.config({})
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import router from "./routes/router";
import cookieParser from "cookie-parser";
import compression from "compression";

const app = express();
const PORT = process.env.PORT;

console.log(
  "Express server running on: " + process.env.NODE_ENV.toUpperCase() + " mode!",
);

console.log("Starting..");

app.use(cookieParser());
app.use(compression());
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.WEBSITE_URL, process.env.BACKEND_URL],
    credentials: true,
  }),
);
app.use(express.json());

connectDB();

app.use("/", router());

app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
});

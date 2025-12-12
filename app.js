import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import deviceMiddleware from "./middleware/device.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(deviceMiddleware);

app.use("/", router);

const PORT = process.env.PORT;


app.listen(PORT,() => console.log(`Shortener online on port ${PORT}`));
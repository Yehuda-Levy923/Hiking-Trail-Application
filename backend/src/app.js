import express from "express";
import cors from "cors";
import trailsRouter from "./routes/trails.js";
import trafficRouter from "./routes/traffic.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/trails", trailsRouter);
app.use("/api/traffic", trafficRouter);

export default app;

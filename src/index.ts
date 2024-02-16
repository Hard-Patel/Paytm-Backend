import "dotenv/config";
import express from "express";
import { v1Controller } from "./routes";

const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/", v1Controller);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

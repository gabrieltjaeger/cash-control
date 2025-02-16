import cors from "cors";
import express from "express";

import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

app.listen(process.env.API_PORT, () => {
  console.log(`Server running on port ${process.env.API_PORT}`);
});

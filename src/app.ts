import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/users/index";
import noteRoute from "./routes/notes/index";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use("/api/user", userRoute);
server.use("/api/note", noteRoute);

const PORT = 4000;
const DB_URL = process.env.MONGODB_URL!;

mongoose
  .connect(DB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("Error while connecting to MongoDB:", err));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

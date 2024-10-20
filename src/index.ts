import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "../src/routes/users/index";
import noteRoute from "../src/routes/notes/index";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/note", noteRoute);

const DB_URL = process.env.MONGODB_URL!;

mongoose
  .connect(DB_URL)
  .then(() => console.log("Mongodb Connection Successfully"))
  .catch((err) => console.log("Error while connection to mongodb", err));

// app.use("/api/users");
// app.use("/api/notes");

app.listen(PORT, () => {
  console.log(`Server is running${PORT}`);
});

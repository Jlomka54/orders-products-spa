import app from "./app.js";
import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 3001;
const mongoUri =
  process.env.MONGO_DB_URL ??
  `mongodb+srv://${encodeURIComponent(process.env.MONGO_DB_USERNAME)}:${encodeURIComponent(process.env.MONGO_DB_PASSWORD)}@cluster0.tuy6u.mongodb.net/${encodeURIComponent(process.env.MONGO_DB_NAME)}?retryWrites=true&w=majority`;

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

startServer();

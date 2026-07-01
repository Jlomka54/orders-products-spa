import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

startServer();

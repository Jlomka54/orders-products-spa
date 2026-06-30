import dns from "node:dns";
import mongoose from "mongoose";

export const connectDB = async () => {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);

  const mongoUri =
    process.env.MONGO_DB_URL ??
    `mongodb+srv://${encodeURIComponent(process.env.MONGO_DB_USERNAME)}:${encodeURIComponent(process.env.MONGO_DB_PASSWORD)}@cluster0.tuy6u.mongodb.net/${encodeURIComponent(process.env.MONGO_DB_NAME)}?retryWrites=true&w=majority`;

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
};

import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

export default app;

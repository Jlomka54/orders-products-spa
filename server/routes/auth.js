import { Router } from "express";
import { getMe, login, register } from "../controllers/Auth.js";
import { checkToken } from "../middlewares/checkToken.js";

const authRouter = new Router();

//Register
authRouter.post("/register", register);

//Login
authRouter.post("/login", login);

//Get Me
authRouter.get("/me", checkToken, getMe);

export default authRouter;

import { Router } from "express";
import { printHelloWorld } from "../controllers/helloWorldController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const hwrouter = Router();

hwrouter.get("/print",authMiddleware, printHelloWorld);

export default hwrouter;

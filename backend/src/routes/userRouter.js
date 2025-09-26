// src/routes/userRouter.js (or .ts)
import { Router } from 'express';
import {getProfileOfUser} from "../controllers/userController.js"
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getMyUrls } from '../controllers/userController.js';
const userRouter = Router();
userRouter.get("/me",authMiddleware,getProfileOfUser);
userRouter.get("/my/urls",authMiddleware,getMyUrls)
export default userRouter;
import { Router } from "express";
import{createShortURL} from "../controllers/shortUrlController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { redirectToOriginal } from "../controllers/shortUrlController.js";
import { updateShortURLController } from "../controllers/shortUrlController.js";
const shortURLRouter = Router();
shortURLRouter.post("/",createShortURL);
shortURLRouter.get("/:shortURL",redirectToOriginal);
shortURLRouter.patch("/:shortURL",updateShortURLController);
export default shortURLRouter;

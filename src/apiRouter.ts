import {Router} from "express";
import postsRouter from "./routes/posts.routes";

const apiRouter: Router = Router();

apiRouter.use(postsRouter)

export default apiRouter;
import {Router} from "express";
import postsRouter from "./routes/posts.routes";
import userRouter from "./routes/user.routes";
import searchRouts from "./routes/search.routs";

const apiRouter: Router = Router();

apiRouter.use(postsRouter)
apiRouter.use(userRouter)
apiRouter.use(searchRouts)

export default apiRouter;
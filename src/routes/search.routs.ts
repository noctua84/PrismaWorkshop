import { Router, Response, Request } from 'express';
import { UserController } from "../controller/user.controller";
import { PostsController } from "../controller/posts.controller";
import { PrismaService } from "../../lib/prisma.service";
import {Post, PrismaClient, Role} from "@prisma/client";
import QueryString from "qs";
import {PostSelection} from "../controller/posts.controller.types";

const searchRouts: Router = Router();
const postSearch: Router = Router();
const userSearch: Router = Router();
const client: PrismaClient = PrismaService.getClient();

const userController: UserController = new UserController(client);
const postsController: PostsController = new PostsController(client);

function intersect(a: any, b: any) {
  return a.filter((item1: { id: any; }) => b.some((item2: { id: any; }): boolean => (item2.id === item1.id)));
}

postSearch.get('/', async (req: Request, res: Response): Promise<void> => {
  const query: QueryString.ParsedQs = req.query;
  let result = null;
  
  if (query.title) {
    const titleSet: PostSelection[] = await postsController.findPostsByTitle(query.title as string)
    if (titleSet.length > 0) {
      result = result ? intersect(result, titleSet) : titleSet;
    }
  }
  
  if (query.published) {
    const publishedResults: PostSelection[] = query.published === 'true' ?
      await postsController.findAllPublishedPosts(true) :
      await postsController.findAllPublishedPosts(false);
    
    if (publishedResults.length > 0) {
      result = result ? intersect(result, publishedResults) : publishedResults;
    }
  }
  
  if (query.authorId) {
    const authorIdSet: Post[] = await postsController.findPostsByAuthorId(Number(query.authorId));
    
    if (authorIdSet.length > 0) {
      result = result ? intersect(result, authorIdSet) : authorIdSet;
    }
  }
  
  if (query.category) {
    const categorySet: PostSelection[] = await postsController.findPostsByCategory(query.category as string);
    
    if (categorySet.length > 0) {
      result = result ? intersect(result, categorySet) : categorySet;
    }
  }
  
  if(result) {
    res.json(result);
  }else {
    res.status(404).json({message: 'No post fond for given query.'});
  }
});

userSearch.get('/', async (req: Request, res: Response): Promise<void> => {
  const query: QueryString.ParsedQs = req.query;
  let result = null;
  const role: string | undefined = query.role?.toString();
  
  if (role) {
    result = await userController.findUsersByRole(role.toUpperCase() as Role);
  }
  
  if (result && result.length > 0) {
    res.json(result);
  } else {
    res.status(404).json({message: 'No user fond for given query.'});
  }
});

searchRouts.use('/search/posts', postSearch);
searchRouts.use('/search/users', userSearch);

export default searchRouts;

import {Request, Response, Router} from "express";
import {PrismaService} from "../../lib/prisma.service";
import {PostsController} from "../controller/posts.controller";
import {Post, Prisma} from "@prisma/client";
import {PostSelection, PostUpdateParams} from "../controller/posts.controller.types";
import QueryString from "qs";

const postsRouter: Router = Router();
const controller: PostsController = new PostsController(PrismaService.getClient())

postsRouter.get('/posts', async (req: Request, res: Response): Promise<void> => {
  const query: QueryString.ParsedQs = req.query
  
  const pgNumber: number = Number(query.pgNumber)
  const pgSize: number = Number(query.pgSize)
  
  const posts: PostSelection[] = await controller.getAllPosts(pgNumber, pgSize)
  res.json(posts)
})

postsRouter.post('/posts', async (req: Request, res: Response): Promise<void>  => {
  const {title, content, published, author, categories} = req.body
  console.log('[postsRouter.post] categories', categories)
  const post: Post = await controller.createPost({
    title,
    content,
    published
  }, author, categories)
  
  res.json(post)
})

postsRouter.get('/posts/aggregation', async (req: Request, res: Response): Promise<void> => {
  const aggregation: Prisma.GetProfileAggregateType<any> = await controller.aggregatePosts()
  
  res.json(aggregation)
})

postsRouter.get('/posts/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const post: PostSelection | null = await controller.getPostById(Number(id))
  
  if (!post) {
    console.log('[postsRouter.get] Post not found')
    
    res.status(404).json({message: 'Post not found'})
  } else {
    res.json(post)
  }
})

postsRouter.put('/posts/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const { title, content, published, categories, author } = req.body
  const updateData: PostUpdateParams = {
    id: Number(id),
    title,
    content,
    published
  }
  
  const post: PostSelection = await controller.updatePostById(updateData, author, categories)
  
  res.json(post)
})

postsRouter.delete('/posts/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  await controller.deletePostById(Number(id))
  
  res.json({message: 'Post deleted'})
})

export default postsRouter
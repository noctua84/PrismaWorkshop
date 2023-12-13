import {Request, Response, Router} from "express";
import {Prisma} from "../../lib/prisma";
import {PostsController} from "../controller/posts.controller";
import {Post} from "@prisma/client";

const postsRouter: Router = Router();
const controller: PostsController = new PostsController(Prisma.getClient())

postsRouter.get('/posts', async (req: Request, res: Response): Promise<void> => {
  const posts: Post[] = await controller.getAllPosts()
  res.json(posts)
})

postsRouter.post('/posts', async (req: Request, res: Response): Promise<void>  => {
  const {title, content} = req.body
  const post: Post = await controller.createPost({
    title,
    content
  })
  
  res.json(post)
})

postsRouter.get('/posts/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const post: Post | null = await controller.getPostById(Number(id))
  
  if (!post) {
    console.log('[postsRouter.get] Post not found')
    
    res.status(404).json({message: 'Post not found'})
  }
  
  res.json(post)
})

postsRouter.put('/posts/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const {title, content} = req.body
  const post: Post = await controller.updatePostById({
    id: Number(id),
    title,
    content
  })
  
  res.json(post)
})

postsRouter.delete('/posts/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  await controller.deletePostById(Number(id))
  
  res.json({message: 'Post deleted'})
})

export default postsRouter
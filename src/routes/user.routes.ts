import { Request, Response, Router } from "express";
import { PrismaService } from "../../lib/prisma.service";
import {UserController, UserUpdateParams} from "../controller/user.controller";
import { User, Prisma } from "@prisma/client";

const userRouter: Router = Router();
const controller: UserController = new UserController(PrismaService.getClient())

userRouter.get('/users', async (req: Request, res: Response): Promise<void> => {
  const users: User[] = await controller.getAllUsers()
  res.json(users)
})

userRouter.post('/users', async (req: Request, res: Response): Promise<void>  => {
  const {name, email, role}: Prisma.UserCreateInput = req.body
  const user: User = await controller.createUser({
    name,
    email,
    role
  })
  
  res.json(user)
})

userRouter.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const user: User | null = await controller.getUserById(Number(id))
  
  if (!user) {
    console.log('[userRouter.get] User not found')
    
    res.status(404).json({message: 'User not found'})
  }
  
  res.json(user)
})

userRouter.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const {name, email, role, posts} = req.body
  const updateData: UserUpdateParams = {
    id: Number(id),
    name,
    email,
    role,
    posts
  }
  
  const user: User = await controller.updateUserById(updateData)
  
  res.json(user)
})

userRouter.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  await controller.deleteUserById(Number(id))
  
  res.json({message: 'User deleted'})
})

export default userRouter

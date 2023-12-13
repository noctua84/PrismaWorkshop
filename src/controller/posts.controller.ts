import {Post, Prisma, PrismaClient} from "@prisma/client";

export class PostsController {
  constructor(private readonly prisma: PrismaClient) {}

  async createPost(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({
      data,
    })
  }

  async getPostById(postId: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    })
  }

  async getAllPosts(): Promise<Post[]> {
    return this.prisma.post.findMany()
  }

  async updatePostById(params: {
    id: number
    title?: string
    content?: string
  }): Promise<Post> {
    const { id, title, content } = params
    return this.prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        content: content,
      },
    })
  }

  async deletePostById(postId: number) {
    return this.prisma.post.delete({
      where: {
        id: postId,
      },
    })
  }
}
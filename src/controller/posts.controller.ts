import {Post, Prisma, PrismaClient, User} from "@prisma/client";
import {PostSelection, PostSelectionArgs, PostUpdateParams} from "./posts.controller.types";
import {PrismaService} from "../../lib/prisma.service";
import {PageArgs} from "../../lib/prisma.service.types";

/**
 * Default query args that are used in most of the prisma queries
 * This is used to avoid code duplication and contains the following:
 * - include author
 */
const postSelectionArgs: PostSelectionArgs = {
  select: {
    id: true,
    title: true,
    content: true,
    published: true,
    author: {
      select: {
        id: true,
        name: true,
        email: true,
      }
    },
    categories: {
      select: {
        name: true,
      }
    }
  }
}

/**
 * Post controller
 */
export class PostsController {
  
  /**
   * Constructor
   *
   * @param prisma
   */
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create post
   *
   * @param data
   */
  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    const postData: Prisma.PostCreateInput = {
      title: data.title,
      content: data.content,
      published: data.published,
      likes: data.likes,
    }
    
    if(data.author) {
      const authorId: number | undefined = data.author.connect?.id || data.author.create?.id || undefined
      
      if (authorId) {
        postData.author = {
          connect: {
            id: authorId,
          }
        }
      } else {
        postData.author = undefined
      }
      
    }
    
    if(data.categories) {
    
    }
    
    return this.prisma.post.create({
      data: {
        ...postData,
      }
    })
  }

  /**
   * Get post by id
   *
   * @param postId
   */
  async getPostById(postId: number): Promise<PostSelection | null> {
    return this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      ...postSelectionArgs
    })
  }

  /**
   * Get all posts
   */
  async getAllPosts(pgNum?: number, pgSize?: number): Promise<PostSelection[]> {
    const pageArgs: PageArgs = PrismaService.paging(pgNum, pgSize)
    
    return this.prisma.post.findMany({
      ...pageArgs,
      ...postSelectionArgs
    })
  }
  
  /**
   * Get all published posts
   */
  async findAllPublishedPosts(published: boolean): Promise<PostSelection[]> {
    return this.prisma.post.findMany({
      where: {
        published: published,
      },
      ...postSelectionArgs
    })
  }
  
  async findPostsByAuthorId(authorId: number): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        authorId,
      },
    })
  }
  
  async findPostsByTitle(query: string): Promise<PostSelection[]> {
    return this.prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      ...postSelectionArgs
    })
  }
  
  async findPostsByCategory(category: string): Promise<PostSelection[]> {
    return this.prisma.post.findMany({
      where: {
        categories: {
          some: {
            name: {
              contains: category,
              mode: 'insensitive',
            },
          },
        },
      },
      ...postSelectionArgs
    })
  }

  /**
   * Update post by id
   *
   * @param params
   */
  async updatePostById(params: PostUpdateParams): Promise<PostSelection> {
    return this.prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        title: params.title,
        content: params.content,
        published: params.published,
        updatedAt: new Date(),
      },
      ...postSelectionArgs
    })
  }

  /**
   * Delete post by id
   *
   * @param postId
   */
  async deletePostById(postId: number) {
    return this.prisma.post.delete({
      where: {
        id: postId,
      },
    })
  }
  
  /**
   * Aggregate posts data by certain fields
   * Currently, this method aggregates posts by:
   * - count of posts
   * - average likes
   * - sum of likes
   */
  async aggregatePosts(): Promise<Prisma.GetPostAggregateType<any>> {
    return this.prisma.post.aggregate({
      _count: true,
      _avg: {
        likes: true,
      },
      _sum: {
        likes: true,
      },
      _max: {
        likes: true,
      },
      _min: {
        likes: true,
      }
    })
  }
}
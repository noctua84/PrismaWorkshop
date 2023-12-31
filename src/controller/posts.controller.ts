import {Post, Prisma, PrismaClient, User} from "@prisma/client";
import {
  PostCategories,
  PostSelection,
  PostSelectionArgs,
  PostSelectionResult,
  PostUpdateParams
} from "./posts.controller.types";
import {PrismaService} from "../../lib/prisma.service";
import {PageArgs} from "../../lib/prisma.service.types";
import {addAuthor, addCategories, formatPost, formatPosts} from "./posts.service";

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
        category: {
          select: {
            name: true,
          }
        }
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
   * @param author
   * @param categories
   */
  async createPost(data: Prisma.PostCreateInput, author: User, categories: string[]): Promise<Post> {
    const postData: Prisma.PostCreateInput = {
      title: data.title,
      content: data.content,
      published: data.published,
      likes: data.likes,
    }
    
    postData.author = await addAuthor(this.prisma, author)
    postData.categories = await addCategories(this.prisma, categories)
    
    console.log('[createPost] authorData', postData.author)
    console.log('[createPost] categoriesData', postData.categories)
    
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
    const post: PostSelectionResult | null = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      ...postSelectionArgs
    })
    
    if (!post) {
      return null
    }
    
    return formatPost(post)
  }

  /**
   * Get all posts
   */
  async getAllPosts(pgNum?: number, pgSize?: number): Promise<PostSelection[]> {
    const pageArgs: PageArgs = PrismaService.paging(pgNum, pgSize)
    
    const posts: PostSelectionResult[] = await this.prisma.post.findMany({
      ...pageArgs,
      ...postSelectionArgs
    })
    
    if (posts.length === 0) {
      return []
    }
    
    return formatPosts(posts)
  }
  
  /**
   * Update post by id
   *
   * @param params
   * @param author
   * @param categories
   */
  async updatePostById(params: PostUpdateParams, author?: User, categories?: string[]): Promise<PostSelection> {
    let categoriesToAdd: string[] = []
    let categoriesToRemove: string[] = []
    const updateData: Prisma.PostUpdateInput = {
      title: params.title,
      content: params.content,
      published: params.published,
      likes: params.likes,
      updatedAt: new Date(),
    }
    
    if (author) {
      updateData.author = await addAuthor(this.prisma, author)
    }
    
    if (categories) {
      const currentCategories = await this.prisma.postCategory.findMany({
        where: {
          postId: params.id,
        },
        select: {
          category: {
            select: {
              name: true,
            }
          }
        }
      })
      
      const currentCategoriesNames: string[] = currentCategories.map((pc: PostCategories) => pc.category.name)
      
      
      categoriesToAdd = categories.filter((category: string) => !currentCategoriesNames.includes(category))
      categoriesToRemove = currentCategoriesNames.filter((category: string) => !categories.includes(category))
    }
    
    const post: PostSelectionResult = await this.prisma.$transaction( async () => {
      if (categoriesToAdd.length > 0) {
        const categoriesToAddData: Prisma.PostCategoryCreateNestedManyWithoutPostInput = await addCategories(this.prisma, categoriesToAdd)
        
        await this.prisma.post.update({
          where: {
            id: params.id,
          },
          data: {
            categories: {
              create: categoriesToAddData.create,
            }
          }
        })
      }
      
      if (categoriesToRemove.length > 0) {
        await this.prisma.postCategory.deleteMany({
          where: {
            postId: params.id,
            category: {
              name: {
                in: categoriesToRemove,
              }
            }
          }
        })
      }

      return this.prisma.post.update({
        where: {
          id: params.id,
        },
        data: {
          ...updateData,
        },
        ...postSelectionArgs
      });
    })
    
    return formatPost(post)
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
   * Get all published posts
   */
  async findAllPublishedPosts(published: boolean): Promise<PostSelection[]> {
    const posts: PostSelectionResult[] = await this.prisma.post.findMany({
      where: {
        published: published,
      },
      ...postSelectionArgs
    })
    
    if (posts.length === 0) {
      return []
    }
    
    return formatPosts(posts)
  }
  
  async findPostsByAuthorId(authorId: number): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        authorId,
      },
    })
  }
  
  async findPostsByTitle(query: string): Promise<PostSelection[]> {
    const posts: PostSelectionResult[] = await this.prisma.post.findMany({
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
    
    if (posts.length === 0) {
      return []
    }
    
    return formatPosts(posts)
  }
  
  async findPostsByCategory(category: string): Promise<PostSelection[]> {
    const posts: PostSelectionResult[] = await this.prisma.post.findMany({
      where: {
        categories: {
          some: {
            category: {
              name: {
                contains: category,
                mode: 'insensitive',
              },
            },
          },
        },
      },
      ...postSelectionArgs
    })
    
    if (posts.length === 0) {
      return []
    }
    
    return formatPosts(posts)
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
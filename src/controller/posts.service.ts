import {Category, Prisma, PrismaClient, User} from "@prisma/client";
import {PostCategories, PostSelectionResult} from "./posts.controller.types";

export const addAuthor = async (client: PrismaClient, author: User): Promise<Prisma.UserCreateNestedOneWithoutPostsInput> => {
  let postAuthorArgs: Prisma.UserCreateNestedOneWithoutPostsInput;
  const authorData = await client.user.findUnique({
    where: {
      email: author.email,
    }
  })
  
  if (!authorData) {
    postAuthorArgs = {
      create: {
        name: author.name,
        email: author.email,
      }
    }
  } else {
    postAuthorArgs = {
      connect: {
        id: authorData.id,
      }
    }
  }
  
  return postAuthorArgs;
}

export const addCategories = async (client: PrismaClient, categories: string[]): Promise<Prisma.PostCategoryCreateNestedManyWithoutPostInput>  => {
  let postCategoriesArgs: Prisma.PostCategoryCreateNestedManyWithoutPostInput;
  const categoryData: Category[] = await client.category.findMany({
    where: {
      name: {
        in: categories,
      }
    }
  })
  
  if (categoryData.length === 0) {
    postCategoriesArgs = {
      create: categories.map((category: string) => ({
        category: {
          create: {
            name: category,
          }
        }
      }))
    }
  } else {
    postCategoriesArgs = {
      create: categoryData.map((category: Category) => ({
        category: {
          connect: {
            id: category.id,
          }
        }
      }))
    }
  }
  
  return postCategoriesArgs;
}

export const formatPosts = (posts: PostSelectionResult[]) => {
  return posts.map((post: PostSelectionResult) => ({
    ...post,
    categories: post.categories.map((pc: PostCategories) => pc.category)
  }))
}

export const formatPost = (post: PostSelectionResult) => {
  return {
    ...post,
    categories: post.categories.map((pc: PostCategories) => pc.category)
  }
}

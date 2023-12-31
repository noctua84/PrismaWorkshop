import { Prisma } from "@prisma/client"

/**
 * Post update params
 */
export interface PostUpdateParams extends Prisma.PostUpdateInput {
  id: number
}

/**
 * Default query args
 */
export interface PostSelectionArgs {
  select: {
    id: boolean
    title: boolean
    content: boolean
    published: boolean
    author: {
      select: {
        id: boolean
        name: boolean
        email: boolean
      }
    }
    categories: {
      select: {
        category: {
          select: {
            name: boolean
          }
        }
      }
    }
  }
}

export interface PostSelectionResult {
  id: number
  title: string
  content: string | null
  published: boolean
  author: {
    id: number
    name: string
    email: string
  } | null,
  categories: {
    category: {
      name: string
    }
  }[]
}

export interface PostCategories {
  category: {
    name: string
  }
}

export interface PostSelection {
  id: number
  title: string
  content: string | null
  published: boolean
  author: {
    id: number
    name: string
    email: string
  } | null,
  categories: {
    name: string
  }[]
}
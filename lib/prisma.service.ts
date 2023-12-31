import { PrismaClient, Prisma } from '@prisma/client'
import {PageArgs} from "./prisma.service.types";

/**
 * Prisma service
 * This service is used to get the Prisma client instance, and provide some helper methods
 * to standardize certain operations.
 */
class PrismaService {
  private static client: PrismaClient | undefined;
  
  private static connect(): void {
    PrismaService.client = new PrismaClient()
  }
  
  /**
   * Get Prisma client instance.
   * This method will initialize the client if it's not initialized yet.
   * It ensures that the client is initialized only once and returns the same instance.
   */
  public static getClient(): PrismaClient {
    if (!PrismaService.client) {
      PrismaService.connect()
    }
    
    // second check to make sure a client is set or throw error if not
    if (!PrismaService.client) {
      throw new Error('Prisma client not initialized')
    }
    
    return PrismaService.client
  }
  
  /**
   * Generate page args for pagination (offset and cursor)
   * - offset: https://www.prisma.io/docs/concepts/components/prisma-client/pagination#offset-based-pagination
   * - cursor: https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
   *
   * This method will generate the page args based on the environment variable PAGING_TYPE
   * If PAGING_TYPE is set to cursor, it will generate cursor based pagination
   * If PAGING_TYPE is set to offset, it will generate offset based pagination
   * If PAGING_TYPE is not set, it will generate offset based pagination
   * If start and pageSize are not set, it will return empty object
   *
   * @param start
   * @param pageSize
   * @returns PageArgs
   */
  public static paging(start?: number, pageSize?: number): PageArgs {
    const pagingType: string = process.env.PAGING_TYPE || 'offset'
    
    if (start && pageSize) {
      if (pagingType === 'cursor') {
        return {
          cursor: {
            id: start,
          },
          take: pageSize,
        }
      }
      
      return {
        skip: (start - 1) * pageSize,
        take: pageSize,
      }
    } else {
      return {}
    }
  }
}

export { PrismaService }
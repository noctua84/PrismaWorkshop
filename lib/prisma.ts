import { PrismaClient } from '@prisma/client'

class Prisma {
  private static client: PrismaClient | undefined;
  private static connect(): void {
    Prisma.client = new PrismaClient()
  }
  
  public static getClient(): PrismaClient {
    if (!Prisma.client) {
      Prisma.connect()
    }
    
    // second check to make sure client is set or throw error if not
    if (!Prisma.client) {
      throw new Error('Prisma client not initialized')
    }
    
    return Prisma.client
  }
}

export { Prisma }
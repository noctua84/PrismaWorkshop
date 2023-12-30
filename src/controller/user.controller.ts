import {Prisma, PrismaClient, Role, User} from "@prisma/client";

/**
 * User update params
 */
export interface UserUpdateParams extends Prisma.UserUpdateInput {
    id: number;
}

/**
 * User controller
 */
export class UserController {
    
    /**
     * Constructor
     *
     * @param prisma
     */
    constructor(private readonly prisma: PrismaClient) {}
    
    /**
     * Create user
     *
     * @param data
     */
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }
    
    /**
     * Get user by id
     * @param userId
     */
    async getUserById(userId: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }
    
    async findUsersByRole(role: Role) {
        return this.prisma.user.findMany({
            where: {
                role,
            },
        });
    }
    
    /**
     * Get all users
     */
    async getAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }
    
    /**
     * Update user by id
     *
     * @param params
     */
    async updateUserById(params: UserUpdateParams): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: params.id,
            },
            data: {
                name: params.name,
                email: params.email,
                role: params.role,
                posts: params.posts,
                profile: params.profile,
                updatedAt: new Date(),
            },
        });
    }
    
    /**
     * Delete user by id
     *
     * @param userId
     */
    async deleteUserById(userId: number) {
        return this.prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }
}

import { PrismaClient } from '@prisma/client';
import { ProcessedUser } from '../types';

export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async saveUsers(users: ProcessedUser[]): Promise<void> {
    try {
      // Clear existing data
      await this.prisma.user.deleteMany();
      
      // Insert new data
      await this.prisma.user.createMany({
        data: users.map(user => ({
          name: user.name,
          email: user.email,
          phone: user.phone,
          timeSpent: user.timeSpent
        }))
      });
    } catch (error) {
      throw new Error(`Database operation failed: ${error}`);
    }
  }

  async getAllUsers(): Promise<ProcessedUser[]> {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { createdAt: 'asc' }
      });
      
      return users.map(user => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        timeSpent: user.timeSpent
      }));
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
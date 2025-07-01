import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getUserBy(where: Partial<Prisma.UserWhereInput>): Promise<User> {
    const user = await this.prisma.user.findFirst({ where });

    if (!user) throw new NotFoundException();

    return user;
  }

  getUsersAll({ skip, take }: PaginateOptions): Promise<PaginatedResult<User>> {
    return this.prisma.paginate(this.prisma.user, { where: {} }, { skip, take });
  }

  async updateUser(userId: string, data: Prisma.UserUpdateInput): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }
}

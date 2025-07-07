import { DatabaseService } from 'src/db/db.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import { UserCreateInput, UserGetOutput, UserUpdateInput } from 'src/db/types/db.types';

@Injectable()
export class UserRepository {
  constructor(private kysely: DatabaseService) {}

  async createUser(data: UserCreateInput): Promise<UserGetOutput> {
    return this.kysely.db
      .insertInto('users')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException());
  }

  async getUserBy(where: Partial<UserGetOutput>): Promise<UserGetOutput> {
    let qb = this.kysely.db.selectFrom('users');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof UserGetOutput, '=', value);
    }

    return qb.selectAll().executeTakeFirstOrThrow(() => new NotFoundException());
  }

  getUsersAll({ skip, take }: PaginateOptions): Promise<PaginatedResult<UserGetOutput>> {
    const qb = this.kysely.db.selectFrom('users').selectAll();

    return this.kysely.paginate(qb, { take, skip });
  }

  async updateUser(userId: string, data: UserUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('users').set(data).where('id', '=', userId).execute();
  }

  async deleteUser(userId: string): Promise<void> {
    await this.kysely.db.deleteFrom('users').where('id', '=', userId).execute();
  }
}

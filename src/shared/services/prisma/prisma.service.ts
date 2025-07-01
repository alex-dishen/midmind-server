import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginatedResult, PaginateOptions, PaginationMetadata } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  generateMeta(take: number, skip: number, total: number): PaginationMetadata {
    const lastPage = Math.ceil(total / take);
    const currentPage = skip === 0 ? 1 : Math.round(skip / take) + 1;

    const meta = {
      total,
      lastPage,
      currentPage,
      perPage: take,
      prev: currentPage > 1 ? currentPage * take - take : null,
      next: currentPage < lastPage ? currentPage * take : null,
    };

    return meta;
  }

  async paginate<T, K extends { where?: any }>(model: any, args: K, options: PaginateOptions): Promise<PaginatedResult<T>> {
    const offset = Number(options?.skip) || 0;
    const limit = Number(options?.take) || 10;

    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: limit,
        skip: offset,
      }),
    ]);

    const meta = this.generateMeta(limit, offset, total);

    return {
      data,
      meta,
    };
  }
}

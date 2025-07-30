import { Pool } from 'pg';
import { DB } from './types/db.types';
import { Kysely, PostgresDialect, SelectQueryBuilder } from 'kysely';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginatedResult, PaginateOptions, PaginationMetadata } from 'src/shared/dtos/pagination.dto';
import { TransactionStorage } from './transactions/transaction-storage';

@Injectable()
export class DatabaseService {
  private readonly dbConnection: Kysely<DB>;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.dbConnection = new Kysely<DB>({
      log: ['query'],
      dialect: new PostgresDialect({ pool }),
    });
  }

  get db(): Kysely<DB> {
    const tx = TransactionStorage.getStore();

    return tx || this.dbConnection;
  }

  private generateMeta = (take: number, skip: number, total: number): PaginationMetadata => {
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
  };

  async paginate<DB, TB extends keyof DB, O = Record<string, unknown>>(
    qb: SelectQueryBuilder<DB, TB, O>,
    { skip = 0, take = 20 }: PaginateOptions,
  ): Promise<PaginatedResult<O>> {
    const [count, data] = await Promise.all([
      qb
        .clearSelect()
        .clearOrderBy()
        .select(eb => eb.fn.countAll<string>().as('total'))
        .executeTakeFirst(),
      qb.limit(take).offset(skip).execute(),
    ]);

    if (!count) {
      throw new InternalServerErrorException('Failed to retrieve total count from database');
    }

    const meta = this.generateMeta(take, skip, 'total' in count ? Number(count.total) : 0);

    return { data, meta };
  }
}

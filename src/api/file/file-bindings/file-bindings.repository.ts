import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { FileBindingCreateInput } from 'src/db/types/db.types';

@Injectable()
export class FileBindingsRepository {
  constructor(private kysely: DatabaseService) {}

  async createBinding(data: FileBindingCreateInput | FileBindingCreateInput[]): Promise<void> {
    await this.kysely.db.insertInto('file_bindings').values(data).execute();
  }
}

import { Injectable } from '@nestjs/common';
import { DirectoryRepository } from './directory.repository';
import { DirectoryUpdateInput } from 'src/db/types/db.types';
import { ChatRepository } from '../chat/chats/chat.repository';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { Transaction } from 'src/db/transactions/transaction.decorator';
import { ChangeDirectoryLocationRequestDto } from './dto/change-directory-location.dto';
import { GetDirectoriesByParentIdOutput } from './types/directory.service.types';

@Injectable()
export class DirectoryService {
  constructor(
    private chatRepository: ChatRepository,
    private directoryRepository: DirectoryRepository,
  ) {}

  async createDirectory(userId: string, data: CreateDirectoryDto): Promise<void> {
    let parentDirectory;

    if (data.parent_directory_id) {
      parentDirectory = await this.directoryRepository.getDirectoryById(data.parent_directory_id);
    }

    const newDirectoryPath = parentDirectory ? [...parentDirectory.path, data.id] : [data.id];

    await this.directoryRepository.createDirectory({
      id: data.id,
      name: data.name,
      user_id: userId,
      type: data.type,
      path: newDirectoryPath,
      depth: (parentDirectory?.depth || 0) + 1,
      parent_directory_id: data.parent_directory_id,
      root_directory_id: parentDirectory?.root_directory_id || data.parent_directory_id,
    });
  }

  async updateDirectory(directoryId: string, data: UpdateDirectoryDto): Promise<void> {
    await this.directoryRepository.updateDirectory(directoryId, { ...data, updated_at: new Date().toISOString() });
  }

  @Transaction()
  async changeDirectoryLocation(directoryId: string, data: ChangeDirectoryLocationRequestDto): Promise<void> {
    const directoryToMove = await this.directoryRepository.getDirectoryById(directoryId);
    let parentPath: string[] | null = null;
    let newRootId: string | null = null;

    if (!directoryToMove) throw new Error('Directory not found');

    if (directoryToMove.parent_directory_id === data.target_parent_id || null) {
      throw new Error('You want to move directory to itself');
    }

    if (data.target_parent_id) {
      const parentDirectory = await this.directoryRepository.getDirectoryById(directoryId);

      if (!parentDirectory) {
        throw new Error('Target parent not found');
      }

      parentPath = parentDirectory.path;
      newRootId = parentDirectory.root_directory_id ?? parentDirectory.id;
    }

    const newPrefix = parentPath ? [...parentPath, directoryId] : [directoryId];

    const fetchedDirectoryIds = await this.directoryRepository.getDirectoryIdsByPathId(directoryId);
    const directoryIdsToUpdate = fetchedDirectoryIds.map(f => f.id);

    const affectedDirectories = await this.directoryRepository.getDirectoriesByIds(directoryIdsToUpdate);

    for (const affectedDirectory of affectedDirectories) {
      const currentPath = affectedDirectory.path;
      const index = currentPath.indexOf(directoryId);

      const newPath = [...newPrefix, ...currentPath.slice(index + 1)];

      const dataForUpdate: DirectoryUpdateInput = {
        path: newPath,
        depth: newPath.length,
        root_directory_id: newRootId,
        updated_at: new Date().toISOString(),
      };

      // We update all of the subtree in a loop, so the directory we initially dragged to a new location is in affectedDirectories
      if (affectedDirectory.id === directoryId) {
        dataForUpdate.parent_directory_id = data.target_parent_id ?? null;
      }

      await this.directoryRepository.updateDirectory(affectedDirectory.id, dataForUpdate);
    }
  }

  async getDirectoriesByParentId(userId: string, parentDirectoryId?: string): Promise<GetDirectoriesByParentIdOutput[]> {
    return this.directoryRepository.getDirectoriesBy({
      user_id: userId,
      is_deleted: false,
      parent_directory_id: parentDirectoryId || null,
    });
  }

  @Transaction()
  async deleteDirectory(directoryId: string): Promise<void> {
    const fetchedDirectoryIds = await this.directoryRepository.getDirectoryIdsByPathId(directoryId);
    const directoryIds = fetchedDirectoryIds.map(fdi => fdi.id);

    await this.directoryRepository.updateDirectoriesByIds(directoryIds, {
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    });

    await this.chatRepository.updateChatsByDirectoryIds(directoryIds, {
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    });
  }
}

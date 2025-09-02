import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../chat/chats/chat.repository';
import { Transaction } from 'src/db/transactions/transaction.decorator';
import { FolderUpdateInput } from 'src/db/types/db.types';
import { FolderRepository } from './folder.repository';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { ChangeFolderLocationRequestDto } from './dto/change-folder-location.dto';
import { GetFoldersByParentIdOutput } from './types/folder.service.types';

@Injectable()
export class FolderService {
  constructor(
    private chatRepository: ChatRepository,
    private folderRepository: FolderRepository,
  ) {}

  async createFolder(userId: string, data: CreateFolderDto): Promise<void> {
    let parentFolder;

    if (data.parent_folder_id) {
      parentFolder = await this.folderRepository.getFolderById(data.parent_folder_id);
    }

    const newFolderPath = parentFolder ? [...parentFolder.path, data.id] : [data.id];

    await this.folderRepository.createFolder({
      id: data.id,
      name: data.name,
      user_id: userId,
      path: newFolderPath,
      depth: (parentFolder?.depth || 0) + 1,
      parent_folder_id: data.parent_folder_id,
      root_folder_id: parentFolder?.root_folder_id || data.parent_folder_id,
    });
  }

  async updateFolder(folderId: string, data: UpdateFolderDto): Promise<void> {
    await this.folderRepository.updateFolder(folderId, { ...data, updated_at: new Date().toISOString() });
  }

  @Transaction()
  async changeFolderLocation(folderId: string, data: ChangeFolderLocationRequestDto): Promise<void> {
    const folderToMove = await this.folderRepository.getFolderById(folderId);
    let parentPath: string[] | null = null;
    let newRootId: string | null = null;

    if (!folderToMove) throw new Error('Folder not found');

    if (folderToMove.parent_folder_id === data.target_parent_id || folderToMove.id === data.target_parent_id) {
      throw new Error('You want to move folder to itself');
    }

    if (data.target_parent_id !== null) {
      const parentFolder = await this.folderRepository.getFolderById(data.target_parent_id);

      if (!parentFolder) {
        throw new Error('Target parent not found');
      }

      parentPath = parentFolder.path;
      newRootId = parentFolder.root_folder_id ?? parentFolder.id;
    }

    const newPrefix = parentPath ? [...parentPath, folderId] : [folderId];

    const fetchedFolderIds = await this.folderRepository.getFolderIdsByPathId(folderId);
    const folderIdsToUpdate = fetchedFolderIds.map(f => f.id);

    const affectedFolders = await this.folderRepository.getFoldersByIds(folderIdsToUpdate);

    for (const affectedFolder of affectedFolders) {
      const currentPath = affectedFolder.path;
      const index = currentPath.indexOf(folderId);

      let newPath = newPrefix;

      if (data.target_parent_id !== null) {
        newPath = [...newPrefix, ...currentPath.slice(index + 1)];
      }

      const dataForUpdate: FolderUpdateInput = {
        path: newPath,
        depth: newPath.length,
        root_folder_id: newRootId,
        updated_at: new Date().toISOString(),
      };

      // We update all of the subtree in a loop, so the folder we initially dragged to a new location is in affectedFolders
      if (affectedFolder.id === folderId) {
        dataForUpdate.parent_folder_id = data.target_parent_id ?? null;
      }

      await this.folderRepository.updateFolder(affectedFolder.id, dataForUpdate);
    }
  }

  async getFoldersByParentId(userId: string, parentFolderId?: string): Promise<GetFoldersByParentIdOutput[]> {
    return this.folderRepository.getFoldersBy({
      user_id: userId,
      is_deleted: false,
      parent_folder_id: parentFolderId || null,
    });
  }

  @Transaction()
  async deleteFolder(folderId: string): Promise<void> {
    const fetchedFolderIds = await this.folderRepository.getFolderIdsByPathId(folderId);
    const folderIds = fetchedFolderIds.map(fdi => fdi.id);

    await this.folderRepository.updateFoldersByIds(folderIds, {
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    });

    await this.chatRepository.updateChatsByFolderIds(folderIds, {
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    });
  }
}

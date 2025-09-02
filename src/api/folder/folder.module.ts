import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { FolderController } from './folder.controller';
import { FolderRepository } from './folder.repository';
import { FolderService } from './folder.service';

@Module({
  imports: [ChatModule],
  controllers: [FolderController],
  providers: [FolderRepository, FolderService],
})
export class FolderModule {}

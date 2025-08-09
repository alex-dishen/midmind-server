import { Module } from '@nestjs/common';
import { DirectoryRepository } from './directory.repository';
import { DirectoryService } from './directory.service';
import { DirectoryController } from './directory.controller';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [DirectoryController],
  providers: [DirectoryRepository, DirectoryService],
})
export class DirectoryModule {}

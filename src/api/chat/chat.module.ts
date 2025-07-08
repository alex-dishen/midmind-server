import { Module } from '@nestjs/common';
import { ChatService } from 'src/api/chat/chat.service';
import { ChatController } from 'src/api/chat/chat.controller';
import { ChatRepository } from 'src/api/chat/chat.repository';

@Module({
  controllers: [ChatController],
  providers: [ChatRepository, ChatService],
})
export class ChatModule {}

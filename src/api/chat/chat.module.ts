import { Module } from '@nestjs/common';
import { ChatService } from 'src/api/chat/chats/chat.service';
import { ChatController } from 'src/api/chat/chats/chat.controller';
import { ChatRepository } from 'src/api/chat/chats/chat.repository';
import { MessageService } from 'src/api/chat/messages/message.service';
import { MessageController } from 'src/api/chat/messages/message.controller';
import { MessageRepository } from 'src/api/chat/messages/message.repository';
import { LLMModule } from 'src/llm/llm.module';

@Module({
  imports: [LLMModule],
  controllers: [ChatController, MessageController],
  providers: [ChatRepository, ChatService, MessageRepository, MessageService],
})
export class ChatModule {}

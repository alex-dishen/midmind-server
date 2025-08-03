import { Module } from '@nestjs/common';
import { LLMModule } from 'src/llm/llm.module';
import { ChatService } from 'src/api/chat/chats/chat.service';
import { ChatController } from 'src/api/chat/chats/chat.controller';
import { ChatRepository } from 'src/api/chat/chats/chat.repository';
import { MessageService } from 'src/api/chat/messages/message.service';
import { MessageController } from 'src/api/chat/messages/message.controller';
import { MessageRepository } from 'src/api/chat/messages/message.repository';
import { ThreadContextRepository } from './thread-contexts/thread-context.repository';
import { ConversationController } from './conversations/conversation.controller';
import { ConversationService } from './conversations/conversation.service';
import { ThreadContextController } from './thread-contexts/thread-context.controller';
import { ThreadContextService } from './thread-contexts/thread-context.service';
import { ConversationRepository } from './conversations/conversation.repository';

@Module({
  imports: [LLMModule],
  controllers: [ConversationController, ChatController, MessageController, ThreadContextController],
  providers: [
    ConversationService,
    ConversationRepository,
    ChatRepository,
    ChatService,
    MessageRepository,
    MessageService,
    ThreadContextRepository,
    ThreadContextService,
  ],
})
export class ChatModule {}

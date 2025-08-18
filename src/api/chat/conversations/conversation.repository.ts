import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService } from 'src/db/db.service';
import { ConnectionType, MessageSenderRole } from 'src/db/types/db.types';

@Injectable()
export class ConversationRepository {
  constructor(private kysely: DatabaseService) {}

  async getFullContextForCurrentConversation(chatId: string): Promise<{ content: string; role: MessageSenderRole }[]> {
    const currentChatData = await this.kysely.db
      .selectFrom('chats')
      .select(['path', 'created_at'])
      .where('id', '=', chatId)
      .executeTakeFirstOrThrow();

    const currentChatMessages = await this.kysely.db
      .selectFrom('messages')
      .select(['id', 'content', 'role'])
      .where('chat_id', '=', chatId)
      .orderBy('created_at', 'asc')
      .execute();

    const descendantChats = await this.kysely.db
      .selectFrom('chats as c')
      .leftJoin('branch_contexts as bc', 'bc.child_chat_id', 'c.id')
      .select(['c.id'])
      .where(sql<boolean>`${chatId} = ANY(c.path)`)
      .where('bc.connection_type', '=', ConnectionType.ATTACHED)
      .execute();

    const ancestorChatIds = currentChatData.path.filter(pId => pId !== chatId);
    const descendantChatIds = descendantChats.filter(dc => dc.id !== chatId).map(dc => dc.id);

    if (ancestorChatIds.length === 0 && descendantChatIds.length === 0) {
      return currentChatMessages;
    }

    const ancestorMessages: { content: string; role: MessageSenderRole }[] = [];

    if (ancestorChatIds.length) {
      const cutoffByAncestor = new Map<string, Date>();

      const path: string[] = currentChatData.path;
      const edges: { parent: string; child: string }[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        edges.push({ parent: path[i], child: path[i + 1] });
      }

      const childIds = edges.map(e => e.child);

      if (childIds.length) {
        const branchRows = (await this.kysely.db
          .selectFrom('branch_contexts as bc')
          .leftJoin('messages as pm', 'pm.id', 'bc.parent_message_id')
          .select([
            'bc.parent_chat_id as parent_chat_id',
            'bc.child_chat_id as child_chat_id',
            'pm.created_at as parent_message_created_at',
          ])
          .where('bc.child_chat_id', 'in', childIds)
          .execute()) as { parent_chat_id: string; child_chat_id: string; parent_message_created_at: Date | null }[];

        for (const row of branchRows) {
          if (row.parent_message_created_at) {
            cutoffByAncestor.set(row.parent_chat_id, row.parent_message_created_at);
          }
        }
      }

      for (const aChatId of ancestorChatIds) {
        const cutoff = cutoffByAncestor.get(aChatId);
        const msgs = await this.kysely.db
          .selectFrom('messages as m')
          .select(['m.id', 'm.content', 'm.role', 'm.created_at'])
          .where('m.chat_id', '=', aChatId)
          // If a parent_message cutoff exists, use it; else fallback to original logic (< current chat created_at)
          .$if(!!cutoff, qb => qb.where('m.created_at', '<=', cutoff!))
          .orderBy('m.created_at', 'asc')
          .execute();

        for (const m of msgs) {
          ancestorMessages.push({ content: m.content, role: m.role });
        }
      }
    }

    const currentChatMessagesWithInjectedChildChatMessages: { content: string; role: MessageSenderRole }[] = [];

    if (descendantChatIds.length) {
      const descendantChatsMessages = await this.kysely.db
        .selectFrom('messages')
        .select(['id', 'chat_id', 'content', 'role', 'created_at'])
        .where('chat_id', 'in', descendantChatIds)
        .orderBy('created_at', 'asc')
        .execute();

      const branchContexts = await this.kysely.db
        .selectFrom('branch_contexts')
        .select(['child_chat_id', 'parent_chat_id', 'parent_message_id', 'created_at'])
        .where('child_chat_id', 'in', descendantChatIds)
        .orderBy('created_at', 'asc')
        .execute();

      const messagesByChat = new Map<string, typeof descendantChatsMessages>();

      for (const message of descendantChatsMessages) {
        if (!messagesByChat.has(message.chat_id)) {
          messagesByChat.set(message.chat_id, []);
        }

        messagesByChat.get(message.chat_id)!.push(message);
      }

      const childrenByParentMessage = new Map<string, string[]>();

      for (const context of branchContexts) {
        const arr = childrenByParentMessage.get(context.parent_message_id) ?? [];
        arr.push(context.child_chat_id);
        childrenByParentMessage.set(context.parent_message_id, arr);
      }

      const injectChildChats = (parentMessageId: string) => {
        const childIds = childrenByParentMessage.get(parentMessageId);

        if (!childIds) return;
        for (const childId of childIds) {
          const msgs = messagesByChat.get(childId);

          if (!msgs) return;
          for (const msg of msgs) {
            currentChatMessagesWithInjectedChildChatMessages.push({ content: msg.content, role: msg.role });
            injectChildChats(msg.id);
          }
        }
      };

      for (const message of currentChatMessages) {
        currentChatMessagesWithInjectedChildChatMessages.push({ content: message.content, role: message.role });
        injectChildChats(message.id);
      }
    }

    const result = [
      ...ancestorMessages,
      ...(currentChatMessagesWithInjectedChildChatMessages.length
        ? currentChatMessagesWithInjectedChildChatMessages
        : currentChatMessages),
    ];

    return result;
  }
}

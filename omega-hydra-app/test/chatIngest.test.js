import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeConversationRecord,
  normalizeConversationsPayload,
} from '../src/utils/chatIngest.js';

test('normalizeConversationRecord maps title, model, tags, and messages', () => {
  const result = normalizeConversationRecord(
    {
      conversationId: 'abc',
      name: 'Strategy sync',
      model_name: 'claude-sonnet-4.5',
      labels: 'growth,planning',
      entries: [
        { id: '1', role: 'user', text: 'Summarize week.' },
        { id: '2', author: 'assistant', message: 'Revenue is up 12%.' },
      ],
    },
    0,
  );

  assert.equal(result.id, 'abc');
  assert.equal(result.title, 'Strategy sync');
  assert.equal(result.model, 'claude-sonnet-4.5');
  assert.deepEqual(result.tags, ['growth', 'planning']);
  assert.deepEqual(result.messages, [
    { id: '1', role: 'user', content: 'Summarize week.' },
    { id: '2', role: 'assistant', content: 'Revenue is up 12%.' },
  ]);
});

test('normalizeConversationsPayload reads chats array aliases', () => {
  const result = normalizeConversationsPayload({
    chats: [
      {
        id: 'chat-1',
        title: 'One',
        provider: 'gemini',
        tags: ['alpha'],
        messages: ['hello'],
      },
    ],
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].title, 'One');
  assert.equal(result[0].model, 'gemini');
  assert.equal(result[0].messages[0].content, 'hello');
});

test('normalizeConversationsPayload returns empty array for unsupported payloads', () => {
  assert.deepEqual(normalizeConversationsPayload({ ok: true }), []);
  assert.deepEqual(normalizeConversationsPayload(null), []);
});

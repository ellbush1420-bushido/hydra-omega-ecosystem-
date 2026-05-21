function asArray(value) {
  if (Array.isArray(value)) return value;
  return [];
}

function pickFirstString(values, fallback) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return fallback;
}

function normalizeTags(input) {
  if (Array.isArray(input)) {
    return input
      .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
      .filter(Boolean);
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeMessage(entry, index) {
  if (typeof entry === 'string') {
    return {
      id: `msg-${index + 1}`,
      role: 'assistant',
      content: entry,
    };
  }

  const item = entry && typeof entry === 'object' ? entry : {};
  const content = pickFirstString(
    [
      item.content,
      item.text,
      item.message,
      item.body,
    ],
    '',
  );

  if (!content) return null;

  const role = pickFirstString([item.role, item.author, item.sender], 'assistant').toLowerCase();
  const id = pickFirstString([item.id, item.message_id], `msg-${index + 1}`);

  return {
    id,
    role,
    content,
  };
}

export function normalizeConversationRecord(record, index) {
  const item = record && typeof record === 'object' ? record : {};
  const messagesSource = asArray(item.messages ?? item.chat ?? item.entries ?? item.turns);
  const messages = messagesSource
    .map((message, messageIndex) => normalizeMessage(message, messageIndex))
    .filter(Boolean);

  return {
    id: pickFirstString([item.id, item.conversationId, item.uuid], `conversation-${index + 1}`),
    title: pickFirstString([item.title, item.name, item.subject], `Conversation ${index + 1}`),
    model: pickFirstString([item.model, item.model_name, item.provider], 'unknown'),
    tags: normalizeTags(item.tags ?? item.labels ?? item.categories),
    messages,
  };
}

export function normalizeConversationsPayload(payload) {
  const candidates = [
    payload?.conversations,
    payload?.chats,
    payload?.data,
    payload?.items,
  ];

  const records = candidates.find(Array.isArray) ?? (Array.isArray(payload) ? payload : []);
  return records.map((record, index) => normalizeConversationRecord(record, index));
}

const Notification = require('../models/notification');

// Fire-and-forget: notification creation is a side effect and must never break
// the main request flow (e.g. assigning a problem still succeeds even if this fails).
async function notifyOne({ recipientId, type, title, message, context, entityType, entityId, linkTo }) {
  try {
    await Notification.create({
      recipient_id: recipientId,
      type,
      title,
      message,
      context: context || '',
      entityType,
      entityId: String(entityId),
      linkTo,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

async function notifyMany(recipientIds, payload) {
  await Promise.all(recipientIds.map((recipientId) => notifyOne({ ...payload, recipientId })));
}

module.exports = { notifyOne, notifyMany };

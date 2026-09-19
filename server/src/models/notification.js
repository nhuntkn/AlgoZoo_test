const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['ASSIGNMENT_ASSIGNED', 'GRADE_RELEASED', 'SUBMISSION_CREATED', 'USER_REGISTERED'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    context: { type: String, default: '' },
    entityType: {
      type: String,
      enum: ['submission', 'problem', 'class', 'user'],
      required: true,
    },
    entityId: { type: String, required: true },
    linkTo: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);

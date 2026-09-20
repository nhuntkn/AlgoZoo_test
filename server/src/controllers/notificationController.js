const Notification = require('../models/notification');

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient_id: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      status: 'success',
      message: 'Notifications retrieved successfully',
      data: notifications.map((n) => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        context: n.context,
        entityType: n.entityType,
        entityId: n.entityId,
        linkTo: n.linkTo,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient_id: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ status: 'error', message: 'Notification not found' });
    }

    res.status(200).json({ status: 'success', message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// PATCH /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient_id: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

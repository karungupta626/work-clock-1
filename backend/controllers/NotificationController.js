const asyncHandler = require("express-async-handler")
const Notification = require('../models/NotificationModel')


const createNotification = asyncHandler(async (req, res) => {
  const { message, user_id } = req.body
  try {
    const notification = new Notification({
      user_id,
      message,
    })
    await notification.save()
    res.status(201).json({ success: true, notification })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' })
  }
})

const getAllNotifications = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const notifications = await Notification.find({ id });
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ error: 'Notifications not found' });
    }
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = { createNotification, getAllNotifications }
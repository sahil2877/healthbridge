const Notification = require('../models/Notification');

// Create a notification for a user. Failures are swallowed so they never
// break the main request flow.
async function notify(userId, { type = 'info', title, body, link } = {}) {
  if (!userId || !title) return;
  try {
    await Notification.create({ user: userId, type, title, body, link });
  } catch (err) {
    /* ignore notification errors */
  }
}

module.exports = notify;

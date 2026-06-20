const mongoose = require('mongoose');

// An in-app notification for a single user
const notificationSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:  { type: String, default: 'info' },   // appointment | lab | invoice | info
  title: { type: String, required: true },
  body:  { type: String },
  link:  { type: String },                     // optional in-app route to open
  read:  { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

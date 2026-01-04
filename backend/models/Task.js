const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  dateTime: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  notified: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String, // or ObjectId if using user authentication
    required: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Task', taskSchema);
// models/Todo.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true // Add index for faster queries
  },
  tasks: [taskSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for sorting
  }
});

// Add compound index for common queries
todoSchema.index({ title: 1, createdAt: -1 });

module.exports = mongoose.model('Todo', todoSchema);
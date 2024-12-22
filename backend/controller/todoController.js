// Get all todos
const Todo = require('../models/Todo');
const cache = require('memory-cache');

// Cache middleware
const cacheMiddleware = (duration) => (req, res, next) => {
  const key = '__express__' + req.originalUrl || req.url;
  const cachedBody = cache.get(key);
  
  if (cachedBody) {
    res.send(cachedBody);
    return;
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  }
};

exports.getAllTodos = [cacheMiddleware(30), async (req, res) => {
  try {
    const todos = await Todo.find()
      .select('title tasks createdAt') // Only select needed fields
      .sort({ createdAt: -1 })
      .lean(); // Use lean for better performance
    
    res.status(200).json({
      status: 'success',
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}];
  
  // Create new todo
  exports.createTodo = async (req, res) => {
    try {
      const newTodo = await Todo.create({
        title: req.body.title
      });
      
      res.status(201).json({
        status: 'success',
        data: newTodo
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  };
  
  // Add task to todo
  exports.addTask = async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.todoId);
      if (!todo) {
        return res.status(404).json({
          status: 'error',
          message: 'Todo not found'
        });
      }
  
      todo.tasks.push({
        description: req.body.description
      });
  
      await todo.save();
  
      res.status(201).json({
        status: 'success',
        data: todo
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  };
  
  // Toggle task completion
  exports.toggleTask = async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.todoId);
      if (!todo) {
        return res.status(404).json({
          status: 'error',
          message: 'Todo not found'
        });
      }
  
      const task = todo.tasks.id(req.params.taskId);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found'
        });
      }
  
      task.completed = !task.completed;
      await todo.save();
  
      res.status(200).json({
        status: 'success',
        data: todo
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  };
  
  // Delete todo
  exports.deleteTodo = async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.todoId);
      if (!todo) {
        return res.status(404).json({
          status: 'error',
          message: 'Todo not found'
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };
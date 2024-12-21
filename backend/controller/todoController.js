// Get all todos
const Todo = require('../models/Todo');

exports.getAllTodos = async (req, res) => {
    try {
      const todos = await Todo.find().sort({ createdAt: -1 });
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
  };
  
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
// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  addTask,
  toggleTask,
  deleteTodo
} = require('../controller/todoController');

router.route('/')
  .get(getAllTodos)
  .post(createTodo);

router.route('/:todoId')
  .delete(deleteTodo);

router.route('/:todoId/tasks')
  .post(addTask);

router.route('/:todoId/tasks/:taskId')
  .patch(toggleTask);

module.exports = router;
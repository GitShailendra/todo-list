import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, List } from 'lucide-react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [taskInputs, setTaskInputs] = useState({}); // Store task inputs for each todo list

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      const result = await response.json();
      setTodos(result.data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle })
      });
      const result = await response.json();
      setTodos([result.data, ...todos]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const addTask = async (todoId) => {
    try {
      const taskDescription = taskInputs[todoId] || '';
      if (!taskDescription.trim()) return; // Don't add empty tasks

      const response = await fetch(`http://localhost:5000/api/todos/${todoId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: taskDescription })
      });
      const result = await response.json();
      setTodos(todos.map(todo => todo._id === todoId ? result.data : todo));
      // Clear only the specific todo's input
      setTaskInputs(prev => ({
        ...prev,
        [todoId]: ''
      }));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (todoId, taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${todoId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      setTodos(todos.map(todo => todo._id === todoId ? result.data : todo));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${todoId}`, {
        method: 'DELETE'
      });
      setTodos(todos.filter(todo => todo._id !== todoId));
      // Clean up the task input state for the deleted todo
      setTaskInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[todoId];
        return newInputs;
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleTaskInputChange = (todoId, value) => {
    setTaskInputs(prev => ({
      ...prev,
      [todoId]: value
    }));
  };

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* SVG Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 tracking-tight">
            Task Master
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">Organize your tasks with style</p>
        </motion.div>

        {/* Create new todo form */}
        <motion.form 
          onSubmit={createTodo}
          className="backdrop-blur-lg bg-white/10 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 transform hover:scale-[1.02] transition-all duration-300 border border-white/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Create a new list..."
              className="w-full flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl border-0 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20"
            >
              <Plus size={20} />
              <span>Create List</span>
            </button>
          </div>
        </motion.form>

        {/* Todo lists */}
        <AnimatePresence>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {todos.map((todo) => (
              <motion.div
                key={todo._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="backdrop-blur-lg bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <List className="text-blue-400" size={20} />
                    <h2 className="text-lg sm:text-xl font-semibold text-white line-clamp-1">{todo.title}</h2>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-slate-400 hover:text-red-400 transition-colors duration-300 p-1.5 sm:p-2 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Tasks */}
                <div className="space-y-2 sm:space-y-3 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                  {todo.tasks.map((task) => (
                    <motion.div
                      key={task._id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <button
                        onClick={() => toggleTask(todo._id, task._id)}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-slate-500 hover:border-blue-400'
                        }`}
                      >
                        {task.completed && <Check size={12} className="text-white" />}
                      </button>
                      <span className={`flex-1 text-sm sm:text-base ${
                        task.completed 
                          ? 'line-through text-slate-500' 
                          : 'text-slate-200'
                      } transition-all duration-300 break-all`}>
                        {task.description}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Add task input */}
                <div className="mt-4 sm:mt-6">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={taskInputs[todo._id] || ''}
                      onChange={(e) => handleTaskInputChange(todo._id, e.target.value)}
                      placeholder="Add a new task..."
                      className="w-full flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl border-0 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 text-sm sm:text-base"
                    />
                    <button
                      onClick={() => addTask(todo._id)}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20"
                    >
                      <Plus size={18} />
                      <span className="sm:hidden">Add Task</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoList;
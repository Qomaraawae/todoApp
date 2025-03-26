import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Plus,
  ArrowLeft,
  Calendar,
  Search,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

function TodoList() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let q = query(collection(db, "todos"), orderBy("createdAt", "desc"));

    if (searchTerm) {
      q = query(
        collection(db, "todos"),
        where("text", ">=", searchTerm),
        where("text", "<=", searchTerm + "\uf8ff")
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let filteredTodos = todosData;
      if (filter === "active") {
        filteredTodos = todosData.filter((todo) => !todo.completed);
      } else if (filter === "completed") {
        filteredTodos = todosData.filter((todo) => todo.completed);
      }

      setTodos(filteredTodos);
    });

    return () => unsubscribe();
  }, [searchTerm, filter]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError("Task cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, "todos"), {
        text: newTodo.trim(),
        completed: false,
        category,
        dueDate,
        priority,
        createdAt: serverTimestamp(),
      });
      setNewTodo("");
      setCategory("");
      setDueDate("");
      setPriority("medium");
      setError("");
    } catch (error) {
      setError("Failed to add task: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todoRef = doc(db, "todos", id);
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        await updateDoc(todoRef, { completed: !todo.completed });
      }
    } catch (error) {
      setError("Failed to update task status: " + error.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} /> Back
          </motion.button>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg ${
                filter === "all" ? "bg-white text-purple-500" : "text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded-lg ${
                filter === "active" ? "bg-white text-purple-500" : "text-white"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-lg ${
                filter === "completed"
                  ? "bg-white text-purple-500"
                  : "text-white"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Task Manager
          </h1>

          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <form onSubmit={addTodo} className="mb-6 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Plus size={24} />
              </motion.button>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} className="text-gray-500" />
                  <label className="text-sm text-gray-600">Category</label>
                </div>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <label className="text-sm text-gray-600">Due Date</label>
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-gray-500" />
                  <label className="text-sm text-gray-600">Priority</label>
                </div>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </form>

          <ul className="space-y-3">
            {todos.map((todo) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="text-purple-500 hover:text-purple-600"
                >
                  {todo.completed ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>

                <div className="flex-1">
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {todo.text}
                  </span>

                  <div className="flex gap-2 mt-1">
                    {todo.category && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {todo.category}
                      </span>
                    )}
                    {todo.dueDate && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getPriorityColor(
                        todo.priority
                      )} bg-opacity-20`}
                    >
                      <AlertTriangle size={12} />
                      {todo.priority}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>

          {todos.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-8"
            >
              No tasks found. Add one to get started!
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TodoList;

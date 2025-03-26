import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, ArrowLeft, Calendar, AlertTriangle, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

function Completed() {
  const navigate = useNavigate();
  const [completedTodos, setCompletedTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const completedData = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((todo) => todo.completed);
      setCompletedTodos(completedData);
    });

    return () => unsubscribe();
  }, []);

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete task: " + error.message);
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
      className="min-h-screen bg-gradient-to-br from-yellow-300 to-blue-500 p-4"
    >
      <div className="max-w-md mx-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/todos")}
          className="mb-6 text-white bg-white-500 border border-white-500 hover:bg-white-600 rounded-lg px-4 py-2 flex-100 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} /> Back to Tasks
        </motion.button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </motion.div>
        )}

        <motion.div className="bg-amber-50 rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-black-900 mb-6">
            Completed Tasks
          </h1>

          <motion.ul className="space-y-3">
            {completedTodos.map((todo) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-4 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
              >
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-700 mt-1"
                >
                  <Trash2 size={20} />
                </button>

                <div className="flex-1">
                  <span className="text-amber-800 line-through">
                    {todo.text}
                  </span>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {todo.category && (
                      <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded flex items-center gap-1">
                        <Tag size={12} />
                        {todo.category}
                      </span>
                    )}
                    {todo.dueDate && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {todo.priority && (
                      <span
                        className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getPriorityColor(
                          todo.priority
                        )} bg-opacity-20`}
                      >
                        <AlertTriangle size={12} />
                        {todo.priority}
                      </span>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {completedTodos.length === 0 && (
            <motion.p className="text-center text-black-600 mt-8">
              No completed tasks yet.
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Completed;

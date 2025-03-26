import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Menu,
  X,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Welcome() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [currentDate] = useState(new Date());

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch completed tasks
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const q = query(
          collection(db, "todos"),
          where("completed", "==", true)
        );
        const querySnapshot = await getDocs(q);
        setCompletedTasksCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      }
    };

    fetchCompletedTasks();
  }, []);

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <ClipboardList size={32} className="text-white mr-2" />
                <span className="text-white font-bold text-xl">TaskFlow</span>
              </motion.div>
            </div>

            {/* Navbar Items */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Completed Tasks */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center bg-white/20 text-white px-3 py-2 rounded-full cursor-pointer"
                onClick={() => navigate("/completed")}
              >
                <CheckCircle2 size={20} className="mr-2" />
                <span>{completedTasksCount} Completed</span>
              </motion.div>

              {/* Calendar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center bg-white/20 text-white px-3 py-2 rounded-full"
              >
                <Calendar size={20} className="mr-2" />
                <span>{formatDate(currentDate)}</span>
              </motion.div>

              {/* Get Started Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/todos")}
                className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-4 py-2 rounded-full hover:shadow-xl transition-all duration-300"
              >
                Start Tasks
                <ChevronRight size={20} className="ml-2" />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-white/10 backdrop-blur-md">
              {/* Completed Tasks */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center bg-white/20 text-white px-3 py-2 rounded-full cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/completed");
                }}
              >
                <CheckCircle2 size={20} className="mr-2" />
                <span>{completedTasksCount} Completed Tasks</span>
              </motion.div>

              {/* Calendar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center bg-white/20 text-white px-3 py-2 rounded-full"
              >
                <Calendar size={20} className="mr-2" />
                <span>{formatDate(currentDate)}</span>
              </motion.div>

              {/* Get Started Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/todos")}
                className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-4 py-2 rounded-full hover:shadow-xl transition-all duration-300"
              >
                Start Tasks
                <ChevronRight size={20} className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center p-4 pt-20"
      >
        <div className="max-w-md w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <ClipboardList size={48} className="text-purple-500" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to TaskFlow
            </h1>
            <p className="text-gray-600 mb-8">
              Organize your tasks beautifully and efficiently
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Welcome;

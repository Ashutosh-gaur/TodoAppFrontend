import React, { useCallback, useEffect, useState } from "react";
import { MdDeleteOutline, MdEdit, MdSearch } from "react-icons/md";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import CategoryModal from "../modal/CategoryModal";
import EditModal from "../modal/EditModal";
import api from "../interceptor/authinterceptor";

function Records({ onCategoryChange }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filteredTask, setFilteredTask] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

 
  const location = useLocation();

  // Fetch all categories
  const fetchCategories = async () => {
    const response = await api.get('/category/getAll', {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    setCategories(response.data);
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    const response = await api.get(`/task/getTasks`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    setTaskList(response.data);
    setFilteredTask(response.data);
  };

  // Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return toast.warning("Please fill task field!");

    const payload = {
      title
    }

    await api.post(`/task/addTask/${!category.trim() ? 0 : category}`, payload, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    setTitle("");
    setCategory("");
    setNewCategory("");
    fetchTasks();
    fetchCategories();
    toast.success("Task created successfully");
    // window.location.reload()
       
  };

  // Edit Task
  const handleEditTask = async () => {
    if (!title) return alert("Please fill task!");


    await api.put(`/task/editTask/${editId}`, { title, categoryId: Number(category) }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
    });

    setTitle("");
    setCategory("");
    setNewCategory("");
    setEditId(null);
    fetchTasks();
    toast.success("Task updated!");
  };

  // Delete Task
  const handleDelete = async (id) => {
    await api.delete(`/task/deleteTask/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });
    fetchTasks();
    toast.success("Task deleted!");
    
  };

  // Toggle Complete
  const handleToggleComplete = async (id) => {
    await api.put(`/task/changeTaskStatus/${id}`, {}, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });
    fetchTasks();
  };

  // Edit Task (set form)
  const handleEdit = (taskItem) => {
   setShowEditModal(!showEditModal)

    setTitle(taskItem.title);
    setCategory(taskItem.category ? taskItem.category.id : "");
    setEditId(taskItem.id);

   
  };

  const AddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return toast.warning("Please enter category name!");

    const payload = {
      name: newCategory
    };

    await api.post(`/category/addCategory`, payload, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    setNewCategory("");
    setShowCategoryModal(false);
    fetchCategories();
    toast.success("Category added successfully");
  };

  // Filter tasks based on category and search
  const filterTasks = useCallback(() => {
    let filtered = taskList;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((task) => task.category?.id === Number(selectedCategory));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTask(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  },[selectedCategory, searchTerm, taskList]);


  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTask.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTask.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle category change from sidebar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') || 'all';
    setSelectedCategory(categoryParam);
  }, [location.search]);

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  // Pie Chart Data
  const pieData = [
    { name: "Completed", value: filteredTask.filter(t => t.completed === "true").length },
    { name: "Pending", value: filteredTask.filter(t => t.completed === "false").length },
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h1 className="text-3xl font-bold text-center text-white">My Records</h1>
        </div>
        <div className="p-8">

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative">
              <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          {/* Enter task */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter Task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white"
              />

              {/* Add category to task */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-700 bg-gray-50 hover:bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Add New Category to ui */}
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                + Category
              </button>

              <button
                onClick={editId ? handleEditTask : handleAddTask}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {editId ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>

          {/* Category Modal */}
          {showCategoryModal && (
           <CategoryModal newCategory={newCategory} setNewCategory={setNewCategory} setShowCategoryModal={setShowCategoryModal} AddCategory={AddCategory} />
            
          )}
          
          {showEditModal && (
           <EditModal title={title} setTitle={setTitle} handleEditTask={handleEditTask} setShowEditModal={setShowEditModal}  categories={categories} category={category} setCategory={setCategory}/>
            
          )}
          

          {/* Task List */}
          <div className="space-y-4 mb-8">
            {currentTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MdSearch size={48} className="mx-auto" />
                </div>
                <p className="text-xl text-gray-500 font-medium">No records found</p>
                <p className="text-gray-400">Try adjusting your search or add a new task</p>
              </div>
            ) : (
              currentTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.title}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        {t.category && (
                          <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                            {t.category.name}
                          </span>
                        )}
                        <span
                          className={`text-sm px-3 py-1 rounded-full font-medium ${t.completed === "true"
                              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                              : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                            }`}
                        >
                          {t.completed === "true" ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={t.completed === "true"}
                          onChange={() => handleToggleComplete(t.id)}
                          className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-600">Done</span>
                      </label>

                      <button
                        onClick={() => handleEdit(t)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                        title="Edit task"
                      >
                        <MdEdit size={20} />
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete task"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-8">
              <nav className="flex items-center space-x-2 bg-white rounded-xl shadow-lg p-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 font-medium text-gray-700 disabled:text-gray-400"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${currentPage === number
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-500 shadow-lg transform scale-105'
                        : 'border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'
                      }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 font-medium text-gray-700 disabled:text-gray-400"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Task Statistics</h2>
            <div className="flex justify-center">
              <PieChart width={350} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Records;

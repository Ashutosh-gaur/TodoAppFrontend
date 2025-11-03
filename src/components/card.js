import React, { useEffect, useState } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Card() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const API = process.env.REACT_APP_API;

  //  Fetch all tasks
  const getAllTasks = async () => {
    try {
      const res = await fetch(`${API}/task/getTasks`,{
        headers: { "Cache-Control": "no-cache" }
      });
      const data = await res.json();
      // console.log("AllTask:", data);
      setTaskList(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  //  Fetch all categories
  const getAllCategories = async () => {
    try {
      const res = await fetch(`${API}/category/getAll`,{
        headers: { "Cache-Control": "no-cache" }
      });
      const data = await res.json();
      setCategories(data);
      // console.log("AllCategories", data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  //  Add New Task (with category)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    let selectedCategoryId = category ? Number(category) : null;

    // If new category entered, create it first
    if (newCategory.trim()) {
      const catRes = await fetch(`${API}/category/addCategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      const catData = await catRes.json();
      selectedCategoryId = catData.id;
      await getAllCategories();
      setNewCategory("");
    }

    // Create new task
    const newTask = {
      title: task,
      completed: "false",
      category: selectedCategoryId ? { id: selectedCategoryId } : null,
    };

    const res = await fetch(`${API}/task/addTask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (res.ok) {
      await getAllTasks();
      setTask("");
      setCategory("");
    }
  };

  //  Delete Task
  const handleDelete = async (id) => {
    const res = await fetch(`${API}/task/deleteTask/${id}`, {
      method: "DELETE",
    });
    if (res.ok) await getAllTasks();
  };

  //  Toggle Complete
  const handleToggleComplete = async (id) => {
    try {
      const res = await fetch(`${API}/task/updateTask/${id}`, {
        method: "PUT",
      });

      if (!res.ok) {
        console.error("Failed to toggle task");
        await getAllTasks();
      }

      const data = await res.json();
      console.log(data);

      setTaskList((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: data.completed } : t))
      );
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

  //  Start Editing
  const startEdit = (task) => {
    setEditingTask(task);
    setTask(task.title);
    setCategory(task.category?.id || "");
  };

 
  //  Save Edited Task
const saveEdit = async () => {
  if (!editingTask) return;

  try {
    // Step 1: Update task title
    const res = await fetch(`${API}/task/editTask/${editingTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task }),
    });

    if (!res.ok) {
      console.error("Failed to update task");
      return;
    }

    const updatedTask = await res.json();

    // Step 2: Update category if selected
    if (category) {
      await fetch(`${API}/task/updateCatagory/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: editingTask.id,
          name: newCategory,
          taskList,
        }),
      });
    }

    // Step 3: Update UI instantly (without reload)
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === editingTask.id
          ? { ...t, title: updatedTask.title }
          : t
      )
    );

    // Step 4: Reset fields
    setEditingTask(null);
    setTask("");
    setCategory("");

    // Step 5: Optional backend refresh for safety
    await getAllTasks();

  } catch (error) {
    console.error("Error saving edit:", error);
  }
};


  // 🟣 Dynamic Filter Effect
  useEffect(() => {
    if (filterCategory) {
      setFilteredTasks(
        taskList.filter((t) => t.categoryName === filterCategory)
      );
    } else {
      setFilteredTasks(taskList);
    }
  }, [filterCategory, taskList]);

  //  Chart Data (based on filtered tasks)
  const completedCount = filteredTasks.filter(
    (t) => t.completed === "true"
  ).length;
  const pendingCount = filteredTasks.length - completedCount;

  const chartData = [
    { name: "Completed", value: completedCount },
    { name: "Pending", value: pendingCount },
  ];

  const COLORS = ["#4CAF50", "#FF9800"];

  // 🟣 Load data initially
  useEffect(() => {
    getAllTasks();
    getAllCategories();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-black min-h-screen py-10 px-4 flex justify-center items-start">
      <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden max-w-screen-md">
        {/* Header */}
        <div className="bg-purple-950 h-40 flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl font-extrabold tracking-wide">ToDo List</h1>
        </div>

        {/* Form Section */}
        <div className="p-6 -mt-10 bg-slate-50 rounded-xl mx-4 shadow-md z-10 relative">
          <form
            onSubmit={editingTask ? saveEdit : handleSubmit}
            className="flex flex-col space-y-4"
          >
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task title..."
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 py-3 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select existing category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Or create new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 py-3 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              className={`${
                task.trim()
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-orange-300 cursor-not-allowed"
              } text-white py-2 rounded-md transition-all duration-300 w-full`}
            >
              {editingTask ? "Save Task" : "Add Task"}
            </button>
          </form>
        </div>

        {/*  Filter Section */}
        <div className="px-6 mt-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Filter Tasks</h2>
          <div className="flex items-center space-x-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-2 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {filterCategory && (
              <button
                onClick={() => setFilterCategory("")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="px-6 pt-4 pb-6">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No tasks found.</p>
          ) : (
            <ul className="space-y-2 mt-4">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center bg-gray-100 py-2 px-4 rounded-lg shadow-sm"
                >
                  <div className="flex-1">
                    <p
                      className={`cursor-pointer text-lg ${
                        t.completed === "true"
                          ? "line-through text-gray-500"
                          : "text-black"
                      }`}
                      onClick={() => handleToggleComplete(t.id)}
                    >
                      {t.title}
                      <span className="ml-2 text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                        {t.categoryName || "Uncategorized"}
                      </span>
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => startEdit(t)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <MdEdit size={25} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDeleteOutline size={25} />
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>

        {/* Chart Section */}
        <div className="flex flex-col justify-center items-center py-6 border-t">
          <h2 className="text-xl font-semibold mb-2">
            {filterCategory
              ? `${filterCategory} - Task Status`
              : "Overall Task Completion"}
          </h2>
          <PieChart width={300} height={250}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default Card;

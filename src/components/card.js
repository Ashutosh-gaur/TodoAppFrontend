import React, { useEffect, useState } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { toast } from "react-toastify";
function Card() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [FilteredTask, setFilteredTask] = useState([]);
  const[selectedCategory,setSelectedCategory]=useState("");
 


  //  Fetch all categories
  const fetchCategories = async () => {
    const response = await fetch(`${process.env.REACT_APP_API}/category/getAll`);
    const data = await response.json();
    setCategories(data);
    // console.log(categories)

  };

  //  Fetch all tasks
  const fetchTasks = async () => {
    const response = await fetch(`${process.env.REACT_APP_API}/task/getTasks`);
    const data = await response.json();
    setTaskList(data);
    setFilteredTask(data); 
  };

  //  Add Task
  const handleAddTask = async () => {
    if (!task) return alert("Please fill task field!");

    let payload = null

    if (!newCategory.trim()) {

      payload = {
        title: task,
        completed: "false"
      }

    } else {

      payload = {
        title: task,
        completed: "false",
        category: {
          name: newCategory
        }
      }

    };


    await fetch(`${process.env.REACT_APP_API}/task/addTask/${!category.trim() ? 0 : category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setTask("");
    setCategory("");
    setNewCategory("");
    fetchTasks();
    fetchCategories();
    toast.success("Task created successfully")

  };

  //  Edit Task
  const handleEditTask = async () => {
    if (!task) return alert("Please fill task!");


    let payload = null

    if (!newCategory.trim()) {

      payload = {
        title: task,
      }



    } else {

      payload = {
        title: task,
        category: {
          name: newCategory
        }
      }

    };

    await fetch(`${process.env.REACT_APP_API}/task/editTask/${editId}/${category === "" ? 0 : category}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setTask("");
    setCategory("");
    setNewCategory("");
    setEditId(null);
    fetchTasks();
    toast.success("Task updated!")
  };

  //  Delete Task
  const handleDelete = async (id) => {
    await fetch(`${process.env.REACT_APP_API}/task/deleteTask/${id}`, { method: "DELETE" });
    fetchTasks();


    toast.success("Task deleted!")


  };

  //  Toggle Complete
  const handleToggleComplete = async (id) => {
    await fetch(`${process.env.REACT_APP_API}/task/changeTaskStatus/${id}`, { method: "PUT" });
    fetchTasks();
  };

  //  Edit Task (set form)
  const handleEdit = (taskItem) => {
    setTask(taskItem.title);
    setCategory(taskItem.category ? taskItem.category.id : 0);
    setEditId(taskItem.id);
  };

  const filterTask = (e) => {


    setSelectedCategory(e.target.value);
    e.target.value==="all"?setFilteredTask(taskList):setFilteredTask(taskList.filter((task) => task.category?.id === Number(e.target.value)))
    
  }

  useEffect(() => {
    fetchCategories();
    fetchTasks();

  }, []);
  useEffect(() => {
   setInterval(() => {
  fetch('/ping')
  console.log("/ping is hitting")
},300000)  // 5 minutes


  }, []);
  





  //  Pie Chart Data
  const pieData = [
    { name: "Completed", value: FilteredTask.filter(t => t.completed === "true").length },
    { name: "Pending", value: FilteredTask.filter(t => t.completed === "false").length },
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="p-5 w-full max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800"> To-Do Manager</h1>

      {/* Enter task */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => {
            return setTask(e.target.value)

          }}
          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
        />

        {/* Add category to task */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* set new category */}
        <input
          type="text"
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={editId ? handleEditTask : handleAddTask}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          {editId ? "Update Task" : "Add Task"}
        </button>

      </div>

      {/* filterTask */}
      <select
        value={selectedCategory}
        onChange={filterTask}
        className="flex ml-auto p-2 my-4 border rounded-md appearance-none text-center outline-none focus:outline-none"
      >
        <option value="all">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>




      <div className="mb-6">
        {FilteredTask.length === 0 ? (
          <p className="text-gray-500 italic">No tasks </p>
        ) : (
          FilteredTask.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm mb-2"
            >
              <div>
                <p className="font-medium text-gray-700">{t.title}
                  <span className="mx-2 font-bold text-xs text-teal-400">{t.category ? `(${t.category.name})` : "(No category)"}</span>
                </p>


                <p
                  className={`text-sm ${t.completed === "true"
                      ? "text-green-600"
                      : "text-orange-500"
                    }`}
                >
                  {t.completed === "true" ? "Completed" : "Pending"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.completed === "true"}
                  onChange={() => handleToggleComplete(t.id)}
                  className="mr-2"
                />
                <MdEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleEdit(t)}
                  size={22}
                />
                <MdDeleteOutline
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(t.id)}
                  size={22}
                />
              </div>
            </div>
          ))
        )}
      </div>



      {/* Pie Chart */}
      <div className="mt-10 flex justify-center">
        <PieChart width={300} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

    </div>

  );

}

export default Card;

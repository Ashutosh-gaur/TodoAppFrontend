import React, { useEffect, useState } from 'react';
import { MdDeleteOutline } from "react-icons/md";

function Card() {
  const [task, setTask] = useState('');
  let [taskList, setTaskList] = useState([]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    const newTask = { title: task, completed: false };
    setTask('')


    try {
      const res = await fetch(`${process.env.REACT_APP_API}/task/addTask`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'

        },
        body: JSON.stringify(newTask)

      })

      if (!res.ok) {
        throw new Error("faild task to add")
      }
      const data = await res.json();


      setTaskList([...taskList, data]);

    } catch (error) {
      console.log(error);

    }

  };

  const handleDelete = async (taskId) => {


    const res = await fetch(`${process.env.REACT_APP_API}/task/deleteTask/${taskId}`, {
      method: "DELETE"
    });

    const data = await res.json()
    setTaskList(data);

  }

  const taskCompletedhandler = async (id) => {

    try {
      const res = await fetch(`${process.env.REACT_APP_API}/task/updateTask/${id}`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }

      })

      const data = await res.json();


      let updateTaskList = taskList.map((task) => {

        return task.id === data.id ? { ...task, completed: data.completed } : task


      })

      setTaskList(updateTaskList);

    } catch (error) {

      console.log(error)

    }

  }


  useEffect(() => {


    const gettingAllTask = async () => {

      try {

        console.log(process.env.REACT_APP_API);

        const res = await fetch(`${process.env.REACT_APP_API}/task/getTasks`);
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await res.json();
        setTaskList(data);
      } catch (error) {

       console.log(await error.json)

      }
    }

    gettingAllTask();


  }, [])



  return (
    <div className='bg-black min-h-screen py-10 px-4 flex justify-center items-start '>
      <div className='w-full  bg-white shadow-xl rounded-2xl overflow-hidden max-w-screen-md'>
        {/* Header Section */}
        <div className='bg-purple-950 h-40 flex flex-col justify-center items-center text-white'>
          <h1 className='text-3xl font-extrabold tracking-wide'>ToDo List</h1>
        </div>

        {/* Form Section */}
        <div className='p-6 -mt-10 bg-slate-50 rounded-xl mx-4 shadow-md z-10 relative '>
          <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center space-y-4 '>
            <input
              type='text'
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder='What would you like to do?'
              className=' w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg'
            />
            <button disabled={!task.trim()}
              type='submit'
              className={`${task.trim() ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer text-white py-2 rounded-md transition-all duration-300 w-[50%]' : 'bg-orange-300 cursor-pointer text-white py-2 rounded-md transition-all duration-300 w-[50%]'}`}
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className='px-6 pt-4 pb-6'>
          {taskList.length === 0 ? (
            <p className='text-gray-500 text-center mt-4'>No tasks added yet.</p>
          ) : (
            <ul className='space-y-2 mt-4  '>
              {taskList.map((t, index) =>

              (
                <div key={t.id} className='flex '>


                  <li

                    className={` bg-gray-100 py-2 px-4 w-full rounded-lg border-l-4 border-blue-500 shadow-sm `}

                  >
                    <span className={` cursor-pointer ${t.completed === true ? 'line-through' : " text-back "}`} onClick={() => taskCompletedhandler(t.id)}>{t.title}</span>
                  </li>

                  <li

                    className='ml-4 bg-red-500 w-10 h-10  text-white  p-1 rounded hover:bg-red-600 cursor-pointer'
                    onClick={() => handleDelete(t.id)}
                  >
                    {<MdDeleteOutline size={30} />}

                  </li>

                </div>


              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;

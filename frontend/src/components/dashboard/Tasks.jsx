"use client";

import { Pencil, Trash2 } from "lucide-react";
import { getTasks, deleteTask } from "@/services/taskService";
import useTaskStore from "@/stores/taskStore";
import { useEffect, useState } from "react";
import { useTask } from "@/context/TaskContext";
import Search from "./Search";
import DeletePopup from "./DeletePopup";
import Loading from "./Loading";
import NoTask from "./NoTask";
import Error from "./Error";
export default function TaskTable() {

  const [serach, setSearch] = useState("");
  const [statusFillter, setStatusFillter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorties");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);


  const { openEditTask,openAddTask} = useTask();

  const {tasks,fetchtask,removeTask,loading,error} = useTaskStore()

  // console.log(tasks,"tasks store rohit")

  // console.log(loading,"loading..............")
  // console.log(error,"error...")
  

  useEffect(() => {

   fetchtask()

  }, []);


  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      await removeTask(selectedTaskId);

      // alert("Task deleted successfully");

      setDeleteOpen(false);
      setSelectedTaskId(null);

    } catch (error) {
      // console.log(error);
      console.log("delete Error:", error);
      console.log("response:", error.response);
      console.log("data:", error.response?.data);

      alert(error.response?.data?.message || "Failed to delete task");
    } finally {
      setLoadingDelete(false);
    }
  };

  const priorityClasses = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-900",
    Low: "bg-blue-100 text-blue-600",
  };

  const statusClasses = {
    Pending: "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-600",
    Completed: "bg-green-100 text-green-600",
  };

  const isToday = (date) => {
    if (!date) return false;

    const today = new Date();
    const taskDate = new Date(date);

    return (
      today.getFullYear() === taskDate.getFullYear() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getDate() === taskDate.getDate()
    );
  };

  const filterdtask = tasks.filter((task) => {
    const matchsearch = task.title.toLowerCase().includes(serach.toLowerCase());

    const matchStatus =
      statusFillter === "All statuses" || task.status === statusFillter;

      // console.log(matchStatus,"matchstatus")

    const matchPriority =
      priorityFilter === "All priorties" || task.priority === priorityFilter;

      // console.log(matchPriority,"matchPriority")

    return matchsearch && matchStatus && matchPriority;
  });

  
    if(loading){
      return <Loading/>
    }

    if(error){
      return (
        <Error
         onRetry={fetchtask}
        />
      )
    }

    if(tasks.length === 0){
      return(
         <NoTask
         onAddTask={openAddTask}
         />
      )
    }


  return (
    <div className="flex flex-col gap-8">
      <div className="">
        <Search
          serach={serach}
          setSearch={setSearch}
          status={statusFillter}
          setStatus={setStatusFillter}
          priority={priorityFilter}
          setPriority={setPriorityFilter}
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-300 bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="px-5 py-4 text-left font-medium">TITLE</th>
              <th className="px-5 py-4 text-left font-medium">ASSIGNED TO</th>
              <th className="px-5 py-4 text-left font-medium">PRIORITY</th>
              <th className="px-5 py-4 text-left font-medium">STATUS</th>
              <th className="px-5 py-4 text-left font-medium">DUE DATE</th>
              <th className="px-5 py-4 text-center font-medium">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length > 0 ? (
              filterdtask.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-300 bg-white last:border-none"
                >
                  {/* Title */}
                  <td className="px-5 py-5 font-medium text-gray-900">
                    {task.title}
                  </td>

                  {/* Assigned User */}
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                        {task.assignedTo?.name
                          ? task.assignedTo.name.substring(0, 2).toUpperCase()
                          : "--"}
                      </div>

                      <span>{task.assignedTo?.name || "Unassigned"}</span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-5">
                    <span
                      className={`rounded-full px-4 py-1 text-sm font-medium ${
                        priorityClasses[task.priority] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      ● {task.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-5">
                    <span
                      className={`rounded-full px-4 py-1 text-sm font-medium ${
                        statusClasses[task.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      ● {task.status}
                    </span>
                  </td>

                  {/* Due Date */}
                  {/* <td className="px-5 py-5">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "--"}
                  </td> */}

                  <td
                    className={`px-5 py-5 ${
                      isToday(task.dueDate)
                        ? "font-medium text-base text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "--"}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <select className="rounded-md border bg-white cursor-pointer border-gray-300 px-3 py-2 text-sm outline-none">
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>

                      <button
                        onClick={() => openEditTask(task)}
                        className="rounded-md border px-3 py-3 bg-white cursor-pointer hover:bg-[#4f46e5]/50 animation border-gray-300"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setDeleteOpen(true);
                        }}
                        className="rounded-md border px-3 py-3 bg-white cursor-pointer hover:bg-red-400 animation border-gray-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No Tasks Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeletePopup
        open={deleteOpen}
        loading={loadingDelete}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedTaskId(null);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}










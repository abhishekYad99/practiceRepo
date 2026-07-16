
"use client";

import React, { useEffect, useState } from "react";
import { createTask,updateTask } from "@/services/taskService";
import { getUsers } from "@/services/userService";
import { useTask } from "@/context/TaskContext";
import useTaskStore from "@/stores/taskStore";


function Taskpopu({}) {

   const {
    open,
    closePopup,
    editingTask
  } = useTask();


  if (!open) return null;

  const {addTask,editTask} = useTaskStore()

  const [users, setUsers] = useState([]);
 


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedUser: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });
 
  console.log(formData,"formdata rohit....")

  useEffect(() => {
  if (editingTask) {
    setFormData({
      title: editingTask.title || "",
      description: editingTask.description || "",
      assignedUser: editingTask.assignedTo?.id || "",
      priority: editingTask.priority || "Medium",
      status: editingTask.status || "Pending",
      dueDate: editingTask.dueDate
        ? editingTask.dueDate.substring(0, 10)
        : "",
    });
  } else {
    setFormData({
      title: "",
      description: "",
      assignedUser: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
    });
  }
}, [editingTask]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();

      console.log("Users", response);

      setUsers(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || null,
      assignedToId: formData.assignedUser === "" ? null : formData.assignedUser,
    };

    console.log("Payload", payload);

    // try {
    //   const response = await createTask(payload);

    //   console.log("Task Created ", response);

    //   alert("Task Created Successfully");

    //   // Tasks.jsx ko bolo dubara fetch kare
    //   window.dispatchEvent(new Event("task-created"));

    //   onClose();

    //   setFormData({
    //     title: "",
    //     description: "",
    //     assignedUser: "",
    //     priority: "Medium",
    //     status: "Pending",
    //     dueDate: "",
    //   });
    // } catch (error) {
    //   console.log("Error", error.response?.data);

    //   alert(
    //     error.response?.data?.message ||
    //       JSON.stringify(error.response?.data) ||
    //       "Something went wrong",
    //   );
    // }

    try {

  if (editingTask) {

    await editTask(editingTask.id, payload);

    alert("Task Updated Successfully");

  } else {

    await addTask(payload);

    alert("Task Created Successfully");

  }

 

  closePopup();

} catch (error) {

  console.log(error);

  alert(
    error.response?.data?.message ||
    "Something went wrong"
  );

}
  };

  return (
    <div className="flex flex-col p-6">
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-semibold">{editingTask ? "Edit Task" : "Add New Task"}</h2>

            <button
              onClick={closePopup}
              className="text-2xl text-gray-500 cursor-pointer hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Task Title */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Task Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Enter Task Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                rows={4}
                name="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-5">
              {/* Assigned User */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Assigned User
                </label>

                <select
                  name="assignedUser"
                  value={formData.assignedUser}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Unassigned</option>

                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={closePopup}
                className="rounded-lg cursor-pointer border px-5 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 cursor-pointer px-5 py-2 text-white hover:bg-blue-700"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Taskpopu;



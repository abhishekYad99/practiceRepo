"use client";

import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openAddTask = () => {
    setEditingTask(null);
    setOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
    setEditingTask(null);
  };

  return (
    <TaskContext.Provider
      value={{
        open,
        editingTask,
        openAddTask,
        openEditTask,
        closePopup,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => useContext(TaskContext);
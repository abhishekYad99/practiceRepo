
"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTask } from "@/context/TaskContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/tasks": "Tasks",
  "/dashboard/documents": "Documents",
};

export default function Header() {
  const pathname = usePathname();

  const { openAddTask } = useTask();

  const title = pageTitles[pathname] || "Dashboard";

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-300 bg-white p-6">
        <h1 className="text-2xl font-semibold">
          {title}
        </h1>

        <div className="flex items-center gap-4">
         <div className="mr-5">
           {pathname === "/dashboard/tasks" && (
            <button
               onClick={openAddTask}
              className="rounded-lg bg-[#4f46e5] px-4 py-3 text-white"
            >
              + Add Task
            </button>
          )}
         </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            RK
          </div>
        </div>
      </header>

   
    </>
  );
}
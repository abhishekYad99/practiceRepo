"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, PenIcon } from "lucide-react";
import { useTask } from "@/context/TaskContext";
import { useAuthStore } from "@/stores/useAuthStore";
import useTaskStore from "@/stores/taskStore";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/tasks": "Tasks",
  "/dashboard/documents": "Documents",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  const { openAddTask } = useTask();
  const {tasks} = useTaskStore()
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.user);

  const fullname = user?.name || "";

  const Names = fullname.split(" ");

  
  const firstname = Names[0] || "";

  const lastname = Names[1] || "";

  //  console.log(firstname,"firstname....??")
  //  console.log(lastname,"lastname....??")

  const initials = ((firstname.charAt(0) || "") + (lastname.charAt(0) || "")).toUpperCase();

  //  console.log(initials,"initials....")
  

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const title = pageTitles[pathname] || "Dashboard";

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const handleLogout = () => {
    clearUser();
    setIsMenuOpen(false);
    router.replace("/login");
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-300 bg-white p-6">
        <h1 className="text-2xl font-semibold">{title}</h1>

        <div className="flex items-center gap-4">
          <div className="mr-5">
            {pathname === "/dashboard/tasks" && (
              <button
                onClick={openAddTask}
                className={`rounded-lg bg-[#4f46e5] ${tasks.length === 0 ? "hidden" : "block"} transition hover:bg-[#0e0796] px-4 py-3 cursor-pointer text-white`}
              >
                + Add Task
              </button>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center cursor-pointer rounded-full bg-blue-100 text-blue-600"
            >
              <span className="text-base font-semibold text-center">
                {initials || "U"}
              </span>
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-4 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 shadow-[18px]"
              >
                {/* user name and email */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-black">
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-600">{user?.email}</span>
                </div>

                {/* user edit */}

                <div className="border-t border-b p-1 mt-2">
                  <div className="flex gap-2 items-center p-2 rounded-md transition hover:bg-gray-100 cursor-pointer">
                    <PenIcon className="h-4 w-4" />
                    <span className="text-sm font-medium text-black">
                      Edit Name
                    </span>
                  </div>
                </div>

                {/* logout button */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full mt-2 text-base cursor-pointer text-start font-medium text-red-700 transition hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}


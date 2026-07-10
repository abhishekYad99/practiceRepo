"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useTask } from "@/context/TaskContext";
import apiClient from "@/services/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/tasks": "Tasks",
  "/dashboard/documents": "Documents",
};

function getInitials(user) {
  const nameParts = user?.name?.trim().split(/\s+/).filter(Boolean) || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return initials || "U";
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  const { openAddTask } = useTask();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const title = pageTitles[pathname] || "Dashboard";
  const initials = getInitials(user);

  useEffect(() => {
    if (!user?.accessToken || user?.name) return undefined;

    let isActive = true;

    apiClient
      .get("/auth/me")
      .then(({ data }) => {
        if (isActive && data?.user) {
          updateUser(data.user);
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
    };
  }, [updateUser, user?.accessToken, user?.name]);

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
    delete apiClient.defaults.headers.common.Authorization;
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
                className="rounded-lg bg-[#4f46e5] px-4 py-3 text-white"
              >
                + Add Task
              </button>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              className="flex h-10 items-center gap-2 rounded-full bg-blue-100 px-1.5 pr-3 text-blue-600 transition hover:bg-blue-200"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold">
                {initials}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-3 w-44 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
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

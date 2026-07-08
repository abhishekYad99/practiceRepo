
"use client";

import { usePathname } from "next/navigation";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/tasks": "Tasks",
  "/dashboard/documents": "Documents",
};

export default function Header() {
  const pathname = usePathname();

  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
        user name
      </div>
    </header>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, SquareCheckBig, FileText, Menu } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: SquareCheckBig,
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: FileText,
    },
  ];

  return (
    // <aside className="w-32 sm:w-40 md:w-58 lg:w-84 bg-[#0f1729] p-2 sm:p-6 text-white flex flex-col gap-10">
    <aside
      className={`bg-[#0f1729] p-2 sm:p-6 text-white flex flex-col gap-10
  transition-all duration-300
  ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center gap-3 ml-1">
        <h1 className="bg-[#4f46e5] w-8 h-8 hidden md:flex justify-center items-center rounded-md font-bold">
          W
        </h1>
        {/* <h2 className="text-base sm:text-xl font-bold">Workspace</h2> */}
        <h2 className={`text-base sm:text-xl font-bold ${!isOpen && "hidden"}`}>
          Workspace
        </h2>
        <div>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu />
          </button>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (
           <Link
               key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg py-3 transition-all duration-200
                ${isOpen ? "px-4  gap-3" : "justify-center"}
                ${
                  isActive
                    ? "bg-[#4f46e5] text-white"
                    : "text-white/60 hover:bg-gray-700 hover:text-white"
                }`}
>
 
              <Icon size={20} />

       
              {isOpen && (
                <span className="font-medium text-xs md:text-base">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

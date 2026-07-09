"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  SquareCheckBig,
  FileText,
} from "lucide-react";

export default function Sidebar() {
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
    <aside className="w-84 bg-[#0f1729] p-6 text-white">
      <h2 className="mb-10 text-2xl font-bold">Workspace</h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
                ${
                  isActive
                    ? "bg-[#4f46e5] text-white"
                    : "text-white/60 hover:bg-gray-700 hover:text-white"
                }`}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
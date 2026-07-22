import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Taskpopu from "@/components/dashboard/Taskpopu";
import { TaskProvider } from "@/context/TaskContext";

export default function DashboardLayout({ children }) {
  return (
    <TaskProvider>
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header />

        <main className="p-4 md:p-6">
          {children}
        </main>

      </div>

      <Taskpopu/>

    </div>
    </TaskProvider>
  );
}


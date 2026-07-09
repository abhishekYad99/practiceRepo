// "use client";

// import { Pencil, Trash2 } from "lucide-react";
// import { getTasks } from "@/services/taskService";
// import { useEffect, useState } from "react";

// export default function TaskTable() {
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await getTasks();

//       console.log("taskschecking rohit", response);

//       setTasks(response.items || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const priorityClasses = {
//     High: "bg-red-100 text-red-600",
//     Medium: "bg-yellow-100 text-yellow-700",
//     Low: "bg-blue-100 text-blue-600",
//   };

//   const statusClasses = {
//     Pending: "bg-gray-100 text-gray-600",
//     "In Progress": "bg-blue-100 text-blue-600",
//     Completed: "bg-green-100 text-green-600",
//   };

//   return (
//     <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
//       <table className="w-full">
//         <thead className="border-b bg-gray-50 text-sm text-gray-500">
//           <tr>
//             <th className="px-5 py-4 text-left font-medium">TITLE</th>
//             <th className="px-5 py-4 text-left font-medium">ASSIGNED TO</th>
//             <th className="px-5 py-4 text-left font-medium">PRIORITY</th>
//             <th className="px-5 py-4 text-left font-medium">STATUS</th>
//             <th className="px-5 py-4 text-left font-medium">DUE DATE</th>
//             <th className="px-5 py-4 text-center font-medium">ACTIONS</th>
//           </tr>
//         </thead>

//         <tbody>
//           {tasks.length > 0 ? (
//             tasks.map((task) => (
//               <tr key={task.id} className="border-b last:border-none">
//                 {/* Title */}
//                 <td className="px-5 py-5 font-medium text-gray-900">
//                   {task.title}
//                 </td>

//                 {/* Assigned User */}
//                 <td className="px-5 py-5">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
//                       {task.assignedTo?.name
//                         ? task.assignedTo.name.substring(0, 2).toUpperCase()
//                         : "--"}
//                     </div>

//                     <span>
//                       {task.assignedTo?.name || "Unassigned"}
//                     </span>
//                   </div>
//                 </td>

//                 {/* Priority */}
//                 <td className="px-5 py-5">
//                   <span
//                     className={`rounded-full px-3 py-1 text-sm font-medium ${
//                       priorityClasses[task.priority] ||
//                       "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     ● {task.priority}
//                   </span>
//                 </td>

//                 {/* Status */}
//                 <td className="px-5 py-5">
//                   <span
//                     className={`rounded-full px-3 py-1 text-sm font-medium ${
//                       statusClasses[task.status] ||
//                       "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     ● {task.status}
//                   </span>
//                 </td>

//                 {/* Due Date */}
//                 <td className="px-5 py-5">
//                   {task.dueDate
//                     ? new Date(task.dueDate).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric",
//                       })
//                     : "--"}
//                 </td>

//                 {/* Actions */}
//                 <td className="px-5 py-5">
//                   <div className="flex items-center justify-center gap-2">
//                     <select className="rounded-md border px-3 py-2 text-sm outline-none">
//                       <option>Pending</option>
//                       <option>In Progress</option>
//                       <option>Completed</option>
//                     </select>

//                     <button className="rounded-md border p-2 hover:bg-gray-100">
//                       <Pencil size={15} />
//                     </button>

//                     <button className="rounded-md border p-2 hover:bg-gray-100">
//                       <Trash2 size={15} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan={6}
//                 className="py-8 text-center text-gray-500"
//               >
//                 No Tasks Found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// ..............................



"use client";

import { Pencil, Trash2 } from "lucide-react";
import { getTasks } from "@/services/taskService";
import { useEffect, useState } from "react";

export default function TaskTable() {
  const [tasks, setTasks] = useState([]);

   useEffect(() => {
  fetchTasks();

  const refreshTasks = () => {
    fetchTasks();
  };

  window.addEventListener("task-created", refreshTasks);

  return () => {
    window.removeEventListener("task-created", refreshTasks);
  };
}, []);

const fetchTasks = async () => {
  try {
    const response = await getTasks();
    setTasks(response.items || []);
  } catch (error) {
    console.log(error);
  }
};

  const priorityClasses = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-blue-100 text-blue-600",
  };

  const statusClasses = {
    Pending: "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-600",
    Completed: "bg-green-100 text-green-600",
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-gray-50 text-sm text-gray-500">
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
            tasks.map((task) => (
              <tr key={task.id} className="border-b last:border-none">
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

                    <span>
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </div>
                </td>

                {/* Priority */}
                <td className="px-5 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
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
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      statusClasses[task.status] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    ● {task.status}
                  </span>
                </td>

                {/* Due Date */}
                <td className="px-5 py-5">
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
                    <select className="rounded-md border px-3 py-2 text-sm outline-none">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>

                    <button className="rounded-md border p-2 hover:bg-gray-100">
                      <Pencil size={15} />
                    </button>

                    <button className="rounded-md border p-2 hover:bg-gray-100">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="py-8 text-center text-gray-500"
              >
                No Tasks Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}



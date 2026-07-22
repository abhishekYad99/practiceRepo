import React from "react";
import { ChevronDown } from "lucide-react";

function Search({
  serach,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
}) {
  return (
    <div className="w-[100%] flex flex-col gap-3 xl:flex-row">
      <div className="w-full xl:w-[80%] h-12 cursor-pointer rounded-md border border-gray-300 bg-white p-3 focus-within:border-blue-500">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={serach}
          className="w-full outline-none focus:border-blue-500"
          type="text"
          placeholder=" ⌕    Search tasks..."
        />
      </div>
      <div className="w-full xl:w-[40%] flex gap-2">
        <div className="relative w-full">
          <ChevronDown
            size={20}
            strokeWidth={2.5}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-bold pointer-events-none"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full appearance-none rounded-md h-12 cursor-pointer border border-gray-300 bg-white py-2 pr-3 pl-6 text-sm outline-none focus:border-blue-500"
          >
            <option>All statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="relative w-full">
          <ChevronDown
            size={20}
            strokeWidth={2.5}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full appearance-none rounded-md h-12 cursor-pointer border border-gray-300 bg-white py-2 pr-3 pl-6 text-sm outline-none focus:border-blue-500"
          >
            <option>All priorties</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Search;

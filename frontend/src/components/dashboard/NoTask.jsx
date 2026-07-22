import React from 'react'

function NoTask({onAddTask}) {
  return (
     <div className="flex h-80 flex-col items-center justify-center gap-4 rounded-xl shadow-sm bg-white">

      <h1 className="text-4xl">
        📭
      </h1>

      <h2 className="text-xl font-medium text-black">
        No tasks yet
      </h2>

      <p className='text-base font-normal text-gray-600'>
        Add your first task to get started.
      </p>

      <button
        onClick={onAddTask}
        className="rounded-lg bg-[#4f46e5] transition hover:bg-[#0e0796] px-4 py-3 cursor-pointer text-white"
      >
        + Add Task
      </button>

    </div>
  )
}

export default NoTask
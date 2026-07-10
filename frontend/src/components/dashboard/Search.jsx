import React from 'react'

function Search({serach,setSearch,status,setStatus,priority,setPriority}) {

  return (
    <div className='w-[100%] flex gap-4'>
         <div className='w-[80%] rounded-md border border-gray-300 bg-white p-3'>
            <input onChange={(e) => setSearch(e.target.value)} value={serach} className='w-full outline-none' type="text" placeholder='Search tasks..' />
         </div>
         <div className='w-[40%] flex gap-2'>
          
                   <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md w-full border bg-white cursor-pointer border-gray-300 px-3 py-2 text-sm outline-none">
                      <option>All statuses</option>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
            
      
                 <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-md w-full border bg-white cursor-pointer border-gray-300 px-3 py-2 text-sm outline-none">
                      <option>All priorties</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                </select>
         
         </div>
    </div>
  )
}

export default Search
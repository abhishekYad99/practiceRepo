import Taskpopu from '@/components/dashboard/Taskpopu'
import Tasks from '@/components/dashboard/Tasks'
import React from 'react'

function page() {
  return (
   <div>
      <div>serach input all statutes soon..</div>
    <div className='h-[600px] overflow-y-scrol mt-12'>
       <Tasks/>
    </div>
   </div>
  )
}

export default page
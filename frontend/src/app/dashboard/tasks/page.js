import Search from '@/components/dashboard/Search'
import Taskpopu from '@/components/dashboard/Taskpopu'
import Tasks from '@/components/dashboard/Tasks'
import React from 'react'

function page() {
  return (
   <div className=''>
     <div className='h-[600px] overflow-y-scrol'>
       <Tasks/>
    </div>
   </div>
  )
}

export default page
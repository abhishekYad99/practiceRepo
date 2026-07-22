import React from 'react'
import Skeleton from './Skeleton'

function Loading() {
  return (
    <div className='flex flex-col gap-4'>
        
    <div className='flex flex-col items-center gap-2'>
       <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-300 border-t-[#4f46e5]" />
       <div className='text-base font-medium text-black'>Loading...</div>
    </div>
       <Skeleton/>
    </div>
  )
}

export default Loading
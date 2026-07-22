import React from 'react'

function Error({onRetry}) {
  return (
   <div className="flex h-80 flex-col items-center justify-center gap-4">
      <h1 className='text-4xl'>⚠️</h1>
      <h2 className="text-2xl font-medium text-black">
        Couldn't load tasks
      </h2>

      <p className='text-base text-gray-600'>
        Something went wrong. Check your connection.
      </p>

      <button
        onClick={onRetry}
        className="rounded-lg bg-white border-gray-300 border cursor-pointer hover:bg-gray-100 transition px-5 py-2 text-black"
      >
        Retry
      </button>

    </div>
  )
}

export default Error

import React from 'react'

function Skeleton() {
const widths = ["100%", "80%", "100%", "90%"];

  return (
    <div className="mt-4 space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-8 w-full rounded-lg bg-gray-200"
         style={{ width: widths[index] }}
        />
      ))}
    </div>
  );
}

export default Skeleton
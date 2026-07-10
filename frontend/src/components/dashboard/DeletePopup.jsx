"use client";
import { Trash2 } from "lucide-react";

function DeletePopup({
  open,
  onClose,
  onDelete,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl flex flex-col justify-center items-center">
       <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <Trash2 className="h-6 w-6 text-red-600" />
       </div>
        <h2 className="text-2xl font-semibold text-center mt-3">
          Delete Task
        </h2>

        <p className="mt-5 text-gray-700 leading-5 text-center text-sm font-normal">
           "Build TaskForm modal" will be permanently removed. This can't be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">

        <div className="w-full flex justify-center gap-4">
                <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg cursor-pointer border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="rounded-lg cursor-pointer bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

        </div>

      </div>
    </div>
  );
}

export default DeletePopup;
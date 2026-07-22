import { create } from "zustand";

import { getTasks,createTask,updateTask,deleteTask } from "@/services/taskService";

const useTaskStore = create((set) => ({
   
   tasks: [],
   loading: false,
   error: null,

   // get task....

    fetchtask: async () => {

      try {

      //  api start
        set({
          loading: true,
          error: null
        })

       const response = await getTasks()

      //  console.log(response,"check rohit store...")

      //  api success

       set({
        tasks: response.results || [],
        loading:false,
       });

      } catch (error) {
        console.log(error)

        // api error
        set({
          loading:false,
          error:error.message
        })
      }
    },

    // add task ....

    addTask: async (payload) => {

      try {

       await createTask(payload)

       const response = await getTasks()

       set({
        tasks: response.results || [],
       });

      } catch (error) {
        console.log(error)
        throw error;
      }
    },

    // edit task........

     editTask: async (id,payload) => {

      try {
       await updateTask(id,payload)

       const response = await getTasks()

       set({
        tasks: response.results || [],
       });

      } catch (error) {
        console.log(error)
        throw error;
      }
    },

    // delete task

     removeTask: async (id) => {

      try {

       await deleteTask(id)

       const response = await getTasks()

       set({
        tasks: response.results || [],
       });

      } catch (error) {
        console.log(error)
         throw error;
      }
    }


}))


export default useTaskStore;
import { create } from "zustand";

import { getTasks,createTask,updateTask,deleteTask } from "@/services/taskService";

const useTaskStore = create((set) => ({
   
    tasks: [],

   // get task....

    fetchtask: async () => {

      try {

       const response = await getTasks()

       set({
        tasks: response.items || [],
       });

      } catch (error) {
        console.log(error)
      }
    },

    // add task ....

    addTask: async (payload) => {

      try {

       await createTask(payload)

       const response = await getTasks()

       set({
        tasks: response.items || [],
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
        tasks: response.items || [],
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
        tasks: response.items || [],
       });

      } catch (error) {
        console.log(error)
         throw error;
      }
    }


}))

export default useTaskStore;
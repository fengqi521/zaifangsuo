import { ref, watch } from "vue"
import { defineStore } from "pinia"
import { setSideBarLists } from "@/utils/cache"

export const useAppStore = defineStore("app", () => {
   const sideLists = ref([])
   // 设置side
   const setSideLists =(lists)=>{
    sideLists.value = lists;
    setSideBarLists(lists)
   }

  return { sideLists,setSideLists }
})

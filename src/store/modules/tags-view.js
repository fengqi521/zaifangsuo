import { ref, watchEffect } from "vue";
import { defineStore } from "pinia";
import { setTagViewsLocal ,getTagViewsLocal} from "@/utils/cache/localStorage";

export const useTagsViewStore = defineStore("tags-view", () => {
  const tags = ref(getTagViewsLocal());

  watchEffect(() => {
    setTagViewsLocal(tags.value);
  });
  // 添加
  const addTagsView = (view) => {
    const index = tags.value.findIndex((tag) => tag.path === view.path);
    if (index > -1) {
      tags.view[index].fullPath !== view.fullPath &&
        (tags.value[index] = { ...view });
    } else {
      tags.value.push({ ...view });
    }
  };

  // 删除
  const deleteTagView = (view) => {
    const index = tags.value.findIndex((v) => v.path === view.path);
    if (index > -1) tags.value.splice(index, 1);
  };

  return { tags, addTagsView, deleteTagView };
});

<template>
  <div>
    <el-upload
      class="upload-demo"
      action="#"
      multiple
      :show-file-list="false"
      :http-request="uploadRequest"
    >
      <slot name="action"></slot>
    </el-upload>
    <ul class="file-container">
      <li
        v-for="(file, index) in props.modelValue"
        :key="index"
        class="file-item"
      >
        <Icon iconClass="icon-wenjian" size="13px" color="#7F7F7F"></Icon>
        <span class="file-name">{{ file.name }}</span>
        <Icon
          iconClass="icon-shanchu close-icon"
          size="13px"
          color="#7F7F7F"
          @click="handleDelete(index)"
        ></Icon>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { useMessage } from "@/plugins/message";
const { error } = useMessage();
const props = defineProps({
  limit: {
    type: Number,
    default: 1,
  },
  accepts: {
    type: Array,
    default: () => ["bin"],
  },
  size: {
    type: Number,
    default: 1,
  },
  url: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["change"]);

const uploadRequest = ({ file }) => {
  if (!file) return;
  // 校验
  const flag = beforeUpload(file);
  if (!flag) return;

  // 上传
  uploadFile(file);
};

// 上传前校验
const beforeUpload = (file) => {
  const fileExtension = file.name.split(".").pop().toLowerCase(); // 获取文件扩展名
  const allowedSize = props.size * 1024 * 1024; // 允许的文件大小

  // 检查文件类型
  if (!props.accepts.includes(fileExtension)) {
    error(`文件类型不正确，请上传${props.accepts.join("、")}格式文件！`);
    return false;
  }

  // 检查文件大小
  if (file.size > allowedSize) {
    error("文件大小超出限制，请上传不超过2MB的文件！");
    return false;
  }

  return true;
};

// 上传文件
const progress = ref(0);

const uploadFile = (file) => {
  const lists = [...props.modelValue];
  if (lists.length >= props.size) {
    lists.pop();
  }
  lists.unshift({ name: file.name, file });
  emit("change", lists);

  return;
  // 取消之前的请求
  if (cancelTokenSource.value) {
    cancelTokenSource.value.cancel(
      "Operation canceled due to new upload request."
    );
  }

  // 创建新的 CancelToken
  cancelTokenSource.value = axios.CancelToken.source();

  // 创建 Axios 实例
  if (!axiosInstance.value) {
    axiosInstance.value = axios.create({
      withCredentials: true,
    });
  }

  // 上传文件
  axiosInstance.value
    .post(`${import.meta.env.VITE_BASE_API}${props.url}`, toFormData(file), {
      headers: { "Content-Type": "multipart/form-data" },
      cancelToken: cancelTokenSource.value.token,
      onUploadProgress: (event) => {
        progress.value = (event.loaded / event.total) * 100;
      },
    })
    .then((res) => {
      if (!res.code) {
        const resList = [
          ...props.modelValue,
          { name: res.data.name, url: res.data.url },
        ];
        emit("change", resList);
        // this.uploadStatus = this.fileUploadStatus.upload_success;
      } else {
        this.$emit("update:changeValue", []);
        // this.uploadStatus = this.fileUploadStatus.upload_error;
      }
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        console.log("Upload canceled");
      } else {
        console.error("Upload failed", error);
      }
    });
};

// 删除
const handleDelete = (index) => {
  const lists = [...props.modelValue];
  lists.splice(index, 1);
  emit("change", lists);
};

//将文件转化成formData
// const toFormData = (file) => {
//   let formData = new FormData();
//   formData.append("file", file);
//   return formData;
// };
</script>
<style lang="css" scoped>
.file-container {
  margin: 8px 0 4px;
  .file-item {
    display: flex;
    align-items: center;
  }
  .file-name {
    padding: 0 4px;
    width: 200px;
    /* line-height: 14px; */
    color: #333;
  }

  .close-icon {
    cursor: pointer;
  }
}
</style>

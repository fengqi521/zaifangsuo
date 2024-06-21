<script setup>

</script>
<template>
    <div class="search-container">
        <el-input v-model="f"  placeholder="请输入消息内容" />
        <el-button type="primary">查询</el-button>
        <el-button type="info">重置</el-button>
    </div>
</template>
<style lang="scss" scoped>
.search-container{
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid var( --br-color);
    text-align: center;

    :deep(.el-input){
        width:180px;
        margin-right: 12px;
    }

    :deep(.el-button){
         width:46px;
         height:24px;
         font-size: 12px;
         border-radius: 3px;
    }
}
</style>
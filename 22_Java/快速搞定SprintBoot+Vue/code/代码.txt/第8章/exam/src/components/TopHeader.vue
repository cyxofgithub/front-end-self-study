<template>
<!-- 头部区域 -->
<el-header class="header">
    <div class="headFont">
        <div
            style="font-family: SourceHanSerifCN-Heavy ;font-size: 50px; color: #409EFF; letter-spacing: 2px; user-select: none;">
            慧测
        </div>
        <div
            style="font-family: SourceHanSerifCN-Heavy ;font-size: 30px; color: #4A4A4A;margin-left: 20px;letter-spacing: 2px;user-select: none;">
            轻松管理学生与考试
        </div>
        <div style="flex-grow: 1;">
        </div>
         <el-avatar :size="40" class="avatar-align">
            <el-icon><UserFilled /></el-icon>
        </el-avatar>
        <div
            style="font-family: SourceHanSerifCN-Regular;font-size: 20px;color: #000000;margin-left: 20px; align-self: center;">
            <p>{{ props.username }}</p>
        </div>
        <el-button type="danger" style="margin-left: 20px; align-self: center;" @click="handleLogout">退出</el-button>
    </div>
</el-header>

</template>

<script setup>

import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const props = defineProps({
    username: String
});
const handleLogout = () => {
    // 移除 cookie 中的 satoken
    document.cookie = 'satoken=; Max-Age=0; path=/';
    // 你可能还想在这里添加一些其他的清理逻辑，如重定向到登录页面
    router.replace({path:"/"})
};
</script>


<style scoped>
.header {
    height: 80px ;
}
.avatar-align {
    transform: translateY(-10px);    
}
.headFont {
    display: flex;
    padding: 5px;
    margin-left: 23%;
    margin-right: 3%;
    align-items: baseline;
}
</style>

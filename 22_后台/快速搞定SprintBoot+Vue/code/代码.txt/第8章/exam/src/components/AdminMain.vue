<template>
    <TopHeader></TopHeader>
    <el-container class="home-container">
        <el-container>
            <!-- 侧边栏 -->
            <el-aside>
                <div v-for="(item, index) in pageList" :key="index" class="btndiv">
                    <button :class="index === pagechoosen ? 'highlightbtn' : 'normalbtn'" @click="changepage(index)">
                        <i :class="item.icon + ' el-icon--left'"></i>{{ item.pageValue }}
                    </button>
                </div>
     
            </el-aside>
            <!-- 右侧内容主题 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import TopHeader from './TopHeader.vue';
const router = useRouter();

const stuId = ref('');
const stuName = ref('');
const pageList = ref([
    { icon: 'el-icon-edit', page: 'adminques', pageValue: '题库管理' },
    { icon: 'el-icon-medal-1', page: 'adminaccount', pageValue: '注册审核' },
]);
const pagechoosen = ref(0);

showpage();
getCookies();


function changepage(index) {
    pagechoosen.value = index;
    showpage();
}

function getCookies() {
    stuId.value = Cookies.get("id");
    stuName.value = Cookies.get("name");
}

function showpage() {
    router.replace({ name: pageList.value[pagechoosen.value].page });
}

</script>

<style scoped>


    .title {
        font-family: SourceHanSerifCN-Heavy;
        font-size: 50px;
        color: #409EFF;
        letter-spacing: 2px;
        user-select: none;
    }

    .subtitle {
        font-family: SourceHanSerifCN-Heavy;
        font-size: 30px;
        color: #4A4A4A;
        margin-left: 15px;
        letter-spacing: 2px;
        user-select: none;
    }

    .flex-grow {
        flex-grow: 1;
    }

    .student-name {
        font-family: SourceHanSerifCN-Regular;
        font-size: 20px;
        color: #000000;
        margin-left: 20px;
        align-self: center;
    }

    .el-aside {
        width: 16%;
        margin-left: 1%;
        margin-right: 1%;
        position: relative;
    }

    .btnbottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
    }

    .btndiv {
        width: 100%;
        display: flex;
        margin-top: 12px;
    }

    .highlightbtn,
    .normalbtn {
        width: 100%;
        border: none;
        padding: 12px 50px;
        text-decoration: none;
        display: inline-block;
        font-size: 25px;
        font-weight: bold;
        border-radius: 5px;
        transition: background-color 0.3s, color 0.3s;
    }

    .highlightbtn {
        background-color: #F5F5F5;
        color: #409EFF;
    }

    .normalbtn {
        background-color: white;
        color: #707070;
    }

    .el-main {
        background-color: #F5F5F5;
        border-radius: 5px;
    }
</style>

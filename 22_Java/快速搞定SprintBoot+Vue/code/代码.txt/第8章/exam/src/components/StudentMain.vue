<template>
	<TopHeader :username="stuName"></TopHeader>
    <el-container>
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
                <div style="height: 80vh;">
                    <router-view></router-view>
                </div>
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
    { icon: 'el-icon-edit', page: 'stuallexam', pageValue: '我的考试' },
    { icon: 'el-icon-medal-1', page: 'stuallscore', pageValue: '我的成绩' },
    { icon: 'el-icon-set-up', page: 'stuallclass', pageValue: '我的班级' },
    { icon: 'el-icon-chat-line-round', page: 'stuallmes', pageValue: '我的通知' },
    { icon: 'el-icon-set-up', page: 'stuinfo', pageValue: '个人信息' },
]);
const pagechoosen = ref(0);

onMounted(() => {
    getCookies();
    showpage();
});

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
.header {
    height: 80px ;
}

.headFont {
    display: flex;
    padding: 5px;
    margin-left: 23%;
    margin-right: 3%;
    align-items: baseline;
}
	.btnbottom {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
	}

	.btndiv {
		width: 100%;
		display: flex;
		margin-top: 12px;
	}

	.highlightbtn {
		width: 100%;
		background-color: #F5F5F5 !important;
		color: #409EFF;
		padding: 12px 100px;
		/* padding-left: 0px; */
		border: none;
		text-decoration: none;
		display: inline-block;
		font-size: 18px;
		font-weight: bold;
		border-radius: 5px;
	}

	.normalbtn {
		background-color: white;
		width: 100%;
		border: none;
		color: #707070;
		padding: 12px 100px;
		/* padding-left: 0px; */
		text-decoration: none;
		display: inline-block;
		font-size: 18px;
		font-weight: bold;
		border-radius: 5px;
	}


</style>

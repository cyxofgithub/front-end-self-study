<template>
    <div>
      <el-header>
        <div style="display: flex; align-items: baseline;">
          <span class="ClassName">{{ className }}</span>
          <div style="flex-grow: 1;"></div>
          <span class="StuNum">{{ stuNum }}人</span>
          <div style="flex-grow: 1;"></div>
          <span class="ClassCode">班级代码：{{ code }}</span>
          <button class="RequestBtn" v-if="haveNewMsg">加入申请：{{ RequestMsg }}</button>
          <button class="RequestBtn" style="opacity: 0.6;cursor: not-allowed;" v-else>
            加入申请：{{ RequestMsg }}
          </button>
        </div>
      </el-header>
      <el-main style="height:66vh">
        <div v-if="stuList != null">
          <div v-for="stu in stuList" :key="stu.id" class="StuList">
            <el-button>{{ stu.name }}</el-button>
          </div>
        </div>
        <div v-else>
          <el-empty description="暂无学生"></el-empty>
        </div>
      </el-main>
      <el-footer>
        <button class="ReleaseClass">解散班级</button>
      </el-footer>
    </div>
  </template>
<script setup>
import { ref, watch,onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
// 监控路由
const route = useRoute();


const classId = ref(0);
const className = ref('');
const stuNum = ref(0);
const stuList = ref([{ id: 0, name: '' }]);
const code = ref('SSFF1234');
const haveNewMsg = ref(false);

onMounted(()=>{
  getStuList(route.query.classId);
  getClass(route.query.classId);
})

watch(() => route.query,(newVlaue,oldValue)=>{
  classId.value = newVlaue.classId;
  className.value = newVlaue.className;
  getStuList(newVlaue.classId);
  getClass(newVlaue.classId);
})

function getStuList(LessonID) {
  axios.get('/lesson/getStudentByLessonId/' + LessonID)
    .then(res => {
      stuList.value = res.data.result;
      stuNum.value = stuList.value.length;
    })
    .catch(err => {
      console.log(err);
    });
}
const getClass = async (LessonID) => {
    try {
        const res = await axios.get('/lesson/getLessonById/' + LessonID);
        code.value = res.data.result.uuid
    } catch (err) {
        console.error(err);
    }
};

</script>


<style scoped>
.ClassName {
	font-size: 200%;
}

.StuNum {
	font-size: 115%;
}

.ClassCode {
	color: #409EFF;
	align-self: center;
	/* margin-left: 20vw; */
	border-style: solid;
	border-width: 1px;
	border-radius: 6px;
	border-color: #409EFF;
	padding: 9px;
}

.RequestBtn {
	margin-left: 1vw;
	align-self: center;
	color: white;
	background-color: #409EFF;
	border: none;
	font-size: 16px;
	padding: 10px 28px;
	border-radius: 6px;
	cursor: pointer;
	display: inline-block;
	text-decoration: none;
}

.RequestBtn:hover {
	opacity: 0.8;
}

.RequestBtn:active {
	opacity: 1;
	background-color: #3897f7;
}

.StuList {
	margin-top: 20px;
	text-align: center;
	float: left;
	margin-left: 1%;
}

.ReleaseClass {
	color: white;
	background-color: red;
	border: none;
	font-size: 16px;
	padding: 10px 28px;
	border-radius: 6px;
	cursor: pointer;
	text-decoration: none;
	float: right;
}

.ReleaseClass:hover {
	opacity: 0.6;
}

.ReleaseClass:active {
	opacity: 1;
	background-color: red;
}
</style>

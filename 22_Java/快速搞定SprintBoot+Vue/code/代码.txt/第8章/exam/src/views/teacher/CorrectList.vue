<template>
    <div>
      <el-header>
        <span class="ClassName">{{ className }}</span>
      </el-header>
      <el-main style="height:74vh;">
        <div v-for="(e, index) in exams" :key="index" class="ExamItemCollapse" v-if="e?.status == '批卷'">
          <div class="ExamItemCollapseHead" @click="clickCollapse(index)">
            <span style="font-size: 150%;">{{ e.name }}</span>
            <div style="flex-grow: 1;"></div>
            <span style="font-size: 100%; margin-right:3vw">{{ e.startTime + '~' + e.endTime.split(' ')[1] }}</span>
            <span class="fontTag" :style="{ 'color': '#E68E0C' }">{{ e.status }}</span>
          </div>
          <collapse-transition>
            <div v-show="openExams[index].isFocus">
              <div v-for="(s, index1) in e.papers" :key="index1" class="Papers">
                <button class="paperBtn" v-if="s.status == '已批阅'" @click="jumpToMark(e.id, s.student.id)">
                  <span style="float: left;">{{ s.student.name }}</span>
                  <span style="float: right;">{{ s.totalPoint + '分' }}</span>
                </button>
                <button class="paperBtnUnReview" v-else-if="s.status != '违规'" @click="jumpToMark(e.id, s.student.id)">
                  <span style="float: left;">{{ s.student.name }}</span>
                  <span style="float: right;">{{ s.status }}</span>
                </button>
              </div>
            </div>
          </collapse-transition>
        </div>
      </el-main>
    </div>
  </template>


<script setup>
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';

const route = useRoute();

const classId = ref(0);
const className = ref('');
const exams = ref([
    {
        id: 0,
        name: '',
        startTime: '',
        endTime: '',
        status: '',
        papers: [
            {
                totalPoint: 0,
                status: '',
                student: {
                    name: ''
                }
            }
        ]
    }
]);
const openExams = ref([]);

onMounted(() => {
	classId.value = route.query.classId;
  	className.value = route.query.className;
    getExams(classId.value);
});

// 监控 exams 的变化
watch(() => exams, (newValue, oldValue) => {
  updateExams(newValue);
});
function updateExams(newExams) {
  openExams.value = newExams.map(() => ({ isFocus: false }));
  newExams.forEach((exam, index) => {
    if (exam.status === '已结束') {
      exam.status = '批卷';
      getStuListAndScore(exam.id, index);
    }
  });
}

function getExams(id) {
  axios({
    method: 'get',
    url: '/exam/getByLesson/' + id
  }).then(res => {
    exams.value = res.data.result;
  }).catch(err => {
    console.log(err);
  });
}

function getStuListAndScore(ExamID, index) {
  axios({
    method: 'get',
    url: '/grade/getGradeByExam/' + ExamID
  }).then(res => {
    exams[index].papers = res.data.result;
  }).catch(err => {
    console.log(err);
  });
}



function clickCollapse(i) {
  var preState = openExams[i].isFocus;
  for (let j = 0; j < openExams.length; j++) {
    openExams[j].isFocus = (i == j);
  }
  if (preState) {
    openExams[i].isFocus = false;
  }
}
function jumpToMark(this_examId, this_stuId) {
  router.push({
				path: '/correct',
				query: {
					examId: this_examId,
					studentId: this_stuId,
				}
			})
    }
</script>

<style scoped>
.ClassName {
	font-size: 200%;
}

.ExamItemCollapse {
	margin-bottom: 1.5vh;
	color: white;
	background-color: rgba(41, 41, 41, 0.589);
	padding: 10px;
	background-color: #EEBE77;
	width: 61vw;
	user-select: none;
	border-radius: 10px;
}

.ExamItemCollapseHead {
	display: flex;
	align-items: center;
	height: 40px;
	padding-left: 1vw;
}

.fontTag {
	font-size: 250%;
	font-weight: bold;
	margin-left: 7vw;
	text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
	filter: blur(1.5px);
	color: #E68E0C;
}


.Papers {
	margin-top: 20px;
	text-align: center;
	float: left;
	overflow: hidden;
	margin-left: 1%;
}

.paperBtnUnReview {
	width: 8vw;
	height: 6vh;
	background-color: #E6A23C;
	color: white;
	border: none;
	font-size: 16px;
	padding-left: 1vw;
	padding-right: 1vw;
	border-radius: 8px;
	cursor: pointer;
	display: inline-block;
	text-decoration: none;
	user-select: none;
}

.paperBtnUnReview:hover {
	background-color: #E2941F;
}

.paperBtnUnReview:active {
	background-color: #E6A23C;
}

.paperBtn {
	width: 8vw;
	height: 6vh;
	background-color: #67C23A;
	color: white;
	border: none;
	font-size: 16px;
	padding-left: 1vw;
	padding-right: 1vw;
	border-radius: 8px;
	cursor: pointer;
	display: inline-block;
	text-decoration: none;
	user-select: none;
}

.paperBtn:hover {
	background-color: #4EBD16;
}

.paperBtn:active {
	background-color: #67C23A;
}
</style>

<template>
    <div>
        <el-header>
            <span class="ClassName">{{ className }}</span>
            <button class="NewExam" @click="newExam">新建考试</button>
        </el-header>
        <el-main style="height:74vh;">
            <div v-if="exams.length != 0">
                <div v-for="(e, index) in exams" :key="index" class="ExamItemCollapse"
                    :style="{ 'background-color': CollapseColor(index), 'width': '61vw' }">
                    <div class="ExamItemCollapseHead" @click="clickCollapse(index)">
                        <span style="font-size: 150%;">{{ e.name }}</span>
                        <div style="flex-grow: 1;"></div>
                        <span style="font-size: 100%; margin-right:3vw">{{ e.startTime + '~' + e.endTime.split(' ')[1] }}</span>
                        <span class="fontTag" :style="{ 'color': StateColor(index) }">{{ e.status }}</span>
                    </div>
                    <collapseTransition>
                        <div v-show="openExams[index]?.isFocus">
                            <div v-for="(s, index1) in e.papers" :key="index1" class="Papers">
                                <button class="paperBtn" v-if="s.status == '已批阅'">
                                    <span style="float: left;">{{ s.student.name }}</span>
                                    <span style="float: right;">{{ s.totalPoint + '分' }}</span>
                                </button>
                                <button class="paperBtnUnReview" v-else-if="s.status != '违规'">
                                    <span style="float: left;">{{ s.student.name }}</span>
                                    <span style="float: right;">{{ s.status }}</span>
                                </button>
                            </div>
                        </div>
                    </collapseTransition>
                </div>
            </div>
            <div v-else>
                <el-empty description="暂无学生"></el-empty>
            </div>
        </el-main>
    </div>
</template>



<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import axios from 'axios';
const router = useRouter();
const route = useRoute();
// 定义响应式数据
const classId = ref(0);
const className = ref("高数一班");
const subjectId = ref(1);
const exams = ref([{
    id: 0,
    name: '',
    startTime: '',
    endTime: '',
    status: '',
    papers: [{
        totalPoint: 0,
        status: '',
        student: {
            name: ''
        }
    }]
}]);
const openExams = ref([]);
// 生命周期钩子
onMounted(() => {
    showpage();
});

// 监视器
watch(route, () => {
    showpage();
});
watch(classId, (newValue) => {
    classId.value = newValue;
    getExams(classId.value);
});
watch(exams, (newValue) => {
    var len = newValue.length;
    if (len > 0) {
        for (let i = 0; i < len; i++) {
            formatStatus(i);
            openExams.value.push({ isFocus: false });
            getStuListAndScore(newValue[i].id, i);
        }
    }
});
// 新建考试
const newExam = () => {
    router.push({
        path: 'papermake',
        query: {
            classId: classId.value,
            subjectId: subjectId.value,
        }
    });
};

// 格式化状态
const formatStatus = (index) => {
    let examStatus = exams.value[index].status;
    if (examStatus === '时间未到')
        exams.value[index].status = '未考';
    else if (examStatus === '正在考试')
        exams.value[index].status = '进行';
    else if (examStatus === '已结束')
        exams.value[index].status = '批卷';
    else
        exams.value[index].status = '完结';
};

// 获取考试列表
const getExams = (id) => {
    axios({
        method: 'get',
        url: '/exam/getByLesson/' + id
    }).then(res => {
        exams.value = res.data.result;
    }).catch(err => {
        console.log(err);
    });
};

// 获取学生列表和分数
const getStuListAndScore = (examId, index) => {
    axios({
        method: 'get',
        url: '/grade/getGradeByExam/' + examId
    }).then(res => {
        exams.value[index].papers = res.data.result;
    }).catch(err => {
        console.log(err);
    });
};

// 根据考试状态返回背景颜色
const CollapseColor = (i) => {
    const status = exams.value[i].status;
    if (status === '未考')
        return '#9BA297';
    else if (status === '进行')
        return "#79BBFF";
    else if (status === "批卷")
        return "#EEBE77";
    else
        return "#95D475";
};

// 根据考试状态返回字体颜色
const StateColor = (i) => {
    const status = exams.value[i].status;
    if (status === "未考")
        return '#616161';
    else if (status === '进行')
        return "#007DFF";
    else if (status === "批卷")
        return "#E68E0C";
    else
        return "#54B027";
};

// 初始化界面
const showpage = () => {
    classId.value = route.query.classId;
    className.value = route.query.className;

    axios({
        method: 'get',
        url: '/lesson/getLessonById/' + classId.value
    }).then(res => {
        subjectId.value = res.data.result.subjectId;
    }).catch(err => {
        console.log(err);
    });
};

function clickCollapse(i) {
  const preState = openExams.value[i].isFocus;
  for (let j = 0; j < openExams.value.length; j++) {
    openExams.value[j].isFocus = (i === j);
  }
  if (preState) {
    openExams.value[i].isFocus = false;
  }

  if (exams.value[i].status === '进行') {
    router.push({ name: 'monitorteacher', query: { roomId: exams.value[i].id, examName: exams.value[i].name } });
  }
}

</script>




<style scoped>
.ClassName {
	font-size: 200%;
}

.NewExam {
	color: white;
	float: right;
	border: none;
	font-size: 16px;
	padding: 8px 26px;
	border-radius: 6px;
	cursor: pointer;
	text-decoration: none;
	user-select: none;
	background-color: #95D475;
}

.NewExam:hover {
	opacity: 0.8;
}

.NewExam:active {
	opacity: 1;
	background-color: #95D475;
}

.ExamItemCollapse {
	margin-bottom: 1.5vh;
	color: white;
	background-color: rgba(41, 41, 41, 0.589);
	padding: 10px;

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

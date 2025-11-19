<template>
    <el-container class="home-container">
      <el-header class="header">
        <el-button size="large">返回</el-button>
        <div style="flex-grow: 1;"></div>
        <div class="header-center" style="font-size: 30px; font-weight: bold;">
          {{ paperName }}
        </div>
        <div style="flex-grow: 1;"></div>
        <el-button size="large" type="success" @click="handIn">提交</el-button>
      </el-header>
      <el-container>
        <el-aside class="leftaside">
            <div style="text-align: center; margin-top: 20px;">
					<div style="font-size: 24px;font-weight: bold;margin-bottom: 10px;">总分</div>
					<div style="font-size: 60px;font-weight: bold;color: #409EFF;">{{paperTotalScore}}</div>
				</div>
				<el-divider></el-divider>
				<div>
					<div style="text-align: center;">
						<h4>考生信息</h4>
					</div>
					<div style="text-align: center;margin-top: 20px;">
						<el-image style="width: 100px; height: 140px" :src="imageUrl" fit="cover">
					
						</el-image>
					</div>
					<div style="margin-top: 20px;"> 姓名：{{stuName}}</div>
					<div style="margin-top: 10px;"> 学号：{{stuId}}</div>
					<div style="margin-top: 10px;"> 班级信息：{{className}}</div>
					<div style="font-size: small;margin-top: 10px;"> 考试时间：{{timeRange}}</div>
				</div>
        </el-aside>
        <el-main>
            <div class="subject" v-for="(item, index) in questionTypeList" :key="index">
            <div v-for="(data, k) in item.questionList" :key="k">
                <div v-if="data.no === questionShow">
                	<div style="display: flex;align-items: baseline;">
								<div style="font-size: 30px;font-weight: bolder; margin-bottom: 20px;">
									{{item.typeName}}
								</div>
								<div style="flex-grow: 20;"></div>
								<div
									style="flex-grow: 1 ; background-color: #67C23A; border-radius: 5px;color: white;text-align: center; padding: 10px;">
									<div style="font-size: larger;font-weight: bolder;">
										{{data.totalScore}}分
									</div>
								</div>
					</div>
                <div slot="header" class="clearfix" style="margin-top: 10px; margin-bottom: 30px;">
                    <el-tag effect="dark" size="medium"> {{ data.number }} </el-tag>
                    <span style="font-weight: bold; font-size: 18px; margin-left: 5px;">{{ data.subject }}</span>
                </div>

                <el-radio-group v-if="item.type === 1" v-model="data.examineAnswer" type="vertical">
                    <div v-for="o in data.answers" :key="o.no" style="float: left; width: 100%;">
                    <el-radio :label="o.no" class="answer-radio" style="margin-bottom: 15px;" disabled>
                        {{ o.answer }}
                    </el-radio>
                    </div>
                </el-radio-group>

               <el-checkbox-group v-if="item.type === 2" v-model="data.examineAnswer" type="vertical">
                    <div v-for="(o, index) in data.answers" :key="index" style="float: left; width: 100%;">
                    <el-checkbox :label="o.no" class="answer-checkbox" style="margin-bottom: 15px;" disabled>
                        {{ o.answer }}
                    </el-checkbox>
                    </div>
                </el-checkbox-group>

                <el-radio-group v-if="item.type === 3" v-model="data.examineAnswer">
                    <div style="width: 100%; margin-bottom: 15px;">
                    <el-radio label="对" class="answer-radio" disabled>对</el-radio>
                    </div>
                    <div style="width: 100%;">
                    <el-radio label="错" class="answer-radio" disabled>错</el-radio>
                    </div>
                </el-radio-group>

                <div v-if="item.type === 4">
                    <div v-for="(i, no) in data.answers" :key="no" style="margin-bottom: 15px;">
                    <el-input type="textarea" :rows="1" v-model="data.examineAnswer[no]" resize="none"
                        maxlength="150" :disabled="true">
                    </el-input>
                    </div>
                </div>

                <el-input v-if="item.type === 5" type="textarea" :rows="10" v-model="data.examineAnswer"
                    resize="none" maxlength="2000" :disabled="true">
                </el-input>

                <div slot="bottom" class="clearfix" style="margin-top: 30px;">
								<el-tag effect="dark" size="medium"> 正确答案 </el-tag>
								<span style="font-size:18px; margin-left: 5px;color: #707070;"
									v-if="item.type===1">{{data.answers[data.answer].answer}}</span>
								<span style="font-size:18px; margin-left: 5px;color: #707070;"
									v-if="item.type===2">{{data.answers[data.answer].answer}}</span>
								<span style="font-size:18px; margin-left: 5px;color: #707070;"
									v-if="item.type===3">{{data.answers[data.answer].answer}}</span>
								<span style="font-size:18px; margin-left: 5px;color: #707070;" v-if="item.type===4">
									<span v-for="(i,no) in data.answers">
										{{data.answers[no]}}
									</span>
								</span>
								<span style="font-size:18px; margin-left: 5px;color: #707070;"
									v-if="item.type===5">{{data.answer}}</span>
							</div>
						</div>
					</div>
				</div>
        </el-main>
        <el-aside class="rightaside">
    <el-divider>
      <h3>答题卡</h3>
    </el-divider>

    <div class="questionCard">
      <div v-for="(item, index) in questionTypeList" :key="index" style="display: left; width: 100%;">
        <div style="width: 100%; margin-top: 10px; margin-bottom: 5px;">
          {{ item.typeName }}
        </div>
        <div style="display: flex; flex-direction: row; width: 100%;">
          <el-button v-for="(data, k) in item.questionList" :key="k" :type="data.buttonType"
            @click="toShowQuestion(data.no)" size="medium">
            {{ data.number }}
          </el-button>
        </div>
      </div>
    </div>

    <el-divider></el-divider>
    <div style="text-align: center;">
      <h4>评分区域</h4>
    </div>

    <div>
      <div style="color: #707070; font-size: medium; margin-bottom: 10px;">快捷操作:</div>
      <el-button @click="wrong" size="medium" type="danger" plain>错误</el-button>
      <el-button @click="halfRight" size="medium" type="warning" plain>半对</el-button>
      <el-button @click="right" size="medium" type="success" plain>正确</el-button>
      <div style="color: #707070; font-size: medium; margin-bottom: 10px; margin-top: 10px;">分数判定:</div>
      <el-input-number v-model="score" :step="1" step-strictly @change="handleScoreChange" :min="minScore"
        :max="maxScore">
      </el-input-number>
      <el-button type="text" style="text-align: end; margin-left: 10px;" @click="cleanScore">清空</el-button>
    </div>
  </el-aside>
      </el-container>
    </el-container>
  </template>


<script setup>
import { ref, onMounted } from 'vue';

const paperName = ref('');
const examId = ref(0);
const studentId = ref(0);
const className = ref('');
const paperTotalScore = ref(0);
const stuName = ref('小明');
const stuId = ref('001');
const imageUrl = ref('zjz.jpg');

const score = ref(0);
const minScore = ref(0);
const maxScore = ref(5);

const startTime = ref('2022-07-05 14:50:00');
const endTime = ref('2022-07-05 15:00:00');
const totalTime = ref(43200000); // 20分钟 20*60*1000
const percent = ref(999);
const m = ref(0);
const s = ref(0);
const timeRange = ref('2022-07-10 18:00-20:00');

const questionShow = ref(0);
const typeShowed = ref(0);
const itemShowed = ref(0);

const pageInfoGet = ref({});
const questionListGet = ref([]);
const stuInfoGet = ref({});

const examingDTOList = ref([]);
const isAllDone = ref(true);

const questionTypeList = ref([]);

// 转换 created 钩子
showpage();

// 使用路由
const router = useRouter();

// 转换 watch 钩子
watch(pageInfoGet, (newValue, oldValue) => {
  pageInfoGet.value = newValue;
  initInfo();
});

watch(questionListGet, (newValue, oldValue) => {
  questionListGet.value = newValue;
  initPaper();
});

watch(stuInfoGet, (newValue, oldValue) => {
  stuInfoGet.value = newValue;
  initStu();
});

watch(questionTypeList, (newValue, oldValue) => {
  questionTypeList.value = newValue;
  showQuestionCard();
  showMark();
});

// 转换 methods
const showpage = () => {
  examId.value = router.currentRoute.value.query.examId;
  studentId.value = router.currentRoute.value.query.studentId;
  getExamInfo();
  getStudent();
};

const getExamInfo = () => {
  axios({
    method: 'get',
    url: '/exam/getById/' + examId.value
  }).then(res => {
    pageInfoGet.value = res.data.result;
  }).catch(err => {
    console.log(err);
  });
};

const getPage = () => {
  axios.get('/mark/getAnswerSheet?examId=' + examId.value + '&studentId=' + studentId.value)
    .then(res => {
      questionListGet.value = res.data.result;
    })
    .catch(err => {
      console.log(err);
    });
};

const getStudent = () => {
  axios.get('/lesson/getStudentInfoById?studentId=' + studentId.value)
    .then(res => {
      stuInfoGet.value = res.data.result;
    })
    .catch(err => {
      console.log(err);
    });
};

const initInfo = () => {
  paperName.value = pageInfoGet.value.name;
  startTime.value = pageInfoGet.value.startTime;
  endTime.value = pageInfoGet.value.endTime;
  className.value = pageInfoGet.value.lesson.name;
  timeRange.value = startTime.value.slice(0, 16).concat("-", endTime.value.slice(11, 16));
};

const initStu = () => {
  stuName.value = stuInfoGet.value.name;
  stuId.value = stuInfoGet.value.id;
  imageUrl.value = stuInfoGet.value.imageUrl;
};

const toShowQuestion = (nowNumber) => {
  questionShow.value = nowNumber;
  showQuestionCard();
  showMark();
};

const showMark = () => {
  for (let i = 0; i < questionTypeList.value.length; i++) {
    for (let o = 0; o < questionTypeList.value[i].questionList.length; o++) {
      if (questionTypeList.value[i].questionList[o].no === questionShow.value) {
        typeShowed.value = i;
        itemShowed.value = o;
        score.value = questionTypeList.value[i].questionList[o].getScore;
        maxScore.value = questionTypeList.value[i].questionList[o].totalScore;
      }
    }
  }
};

// 定义方法
const showQuestionCard = () => {
  questionTypeList.value.forEach((item, i) => {
    item.questionList.forEach((q, o) => {
      let isDone = q.getScore !== undefined;
      q.buttonType = isDone ? 'success' : '';
      if (questionShow.value === q.no) {
        q.buttonType = 'primary';
      }
    });
  });
};

const wrong = () => {
  score.value = 0;
  handleScoreChange();
};

const halfRight = () => {
  score.value = maxScore.value / 2;
  handleScoreChange();
};

const right = () => {
  score.value = maxScore.value;
  handleScoreChange();
};

const cleanScore = () => {
  score.value = undefined;
  handleScoreChange();
};

const handleScoreChange = () => {
  const typeIndex = typeShowed.value;
  const itemIndex = itemShowed.value;
  if (questionTypeList.value[typeIndex]) {
    questionTypeList.value[typeIndex].questionList[itemIndex].getScore = score.value;
    getTotalScore();
  }
};

const getTotalScore = () => {
  let totalScore = 0;
  questionTypeList.value.forEach(item => {
    item.questionList.forEach(q => {
      if (q.getScore !== undefined) {
        totalScore += q.getScore;
      }
    });
  });
  paperTotalScore.value = totalScore;
};

const preserve = () => {
  isAllDone.value = true;
  questionTypeList.value.forEach((type, i) => {
    type.questionList.forEach((question, o) => {
      examingDTOList.value[i].questionList[o].getScore = question.getScore;
      if (question.getScore === undefined) {
        isAllDone.value = false;
      }
    });
  });
  console.log(examingDTOList.value);
};

const handIn = () => {
  preserve();

  if (isAllDone.value) {
    ElMessageBox.confirm('此操作将提交改卷, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      axios.post('/mark/postAnswerSheet', examingDTOList.value, {
        params: {
          examId: examId.value,
          studentId: studentId.value
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        ElMessage({
          message: '保存成功',
          type: 'success'
        });
        console.log(res.data);
      }).catch(err => {
        console.log(err);
      });
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消提交'
      });
    });
  } else {
    ElMessage.error('还未批改完哦，暂时无法提交');
  }
};
const initPaper = () => {
  examingDTOList.value = JSON.parse(JSON.stringify(questionListGet.value));
  questionListGet.value.forEach((item, i) => {
    switch (item.typeName) {
      case "单选题":
        item.type = 1;
        break;
      case "多选题":
        item.type = 2;
        break;
      case "填空题":
        item.type = 4;
        break;
      case "简答题":
        item.type = 5;
        break;
      // 默认情况的处理
    }

    item.questionList.forEach((q, o) => {
      q.number = o + 1;
      const obj = JSON.parse(q.stem);
      q.subject = obj.itemLabel;
      q.answers = obj.answerArray;
      q.buttonType = '';

      switch (item.typeName) {
        case "单选题":
          q.examineAnswer = Number(q.examineAnswer);
          q.answer = Number(q.answer);
          break;
        case "多选题":
          q.examineAnswer = q.examineAnswer.split(",");
          q.answers = q.answer.split(",");
          break;
        case "填空题":
          q.examineAnswer = q.examineAnswer.split(",");
          q.answers = q.answer.split(",");
          q.getScore = undefined;
          break;
        case "简答题":
          q.getScore = undefined;
          break;
        // 默认情况的处理
      }
    });
  });
  console.log(questionListGet.value);
  questionTypeList.value = questionListGet.value;
  questionShow.value = questionTypeList.value[0]?.questionList[0]?.no;
  getTotalScore();
};

onMounted(() => {
    showQuestionCard();
});



</script>

<style scoped>
	.home-container {
		height: 100%;
		background-color: #F5F5F5;
	}

	.header {
		height: 7vh !important;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.leftaside {
		padding: 15px;
		background-color: white;
		width: 300px !important;
		height: 91vh;
		margin-left: 1%;
		margin-right: 1%;
		/* margin-bottom: 1%; */
		border-radius: 5px;
	}

	.demo-progress .el-progress--line {
		width: 350px;
	}


	.questionCard {
		margin-buttom: 10px !important;
	}

	.el-main {
		background-color: white;
		border-radius: 5px;
		/* margin-bottom: 1%; */
		height: 91vh;
	}

	.el-radio /deep/ .el-radio__label {
		font-size: 16px !important;
	}

	.el-checkbox /deep/ .el-checkbox__label {
		font-size: 16px !important;
	}

	.rightaside {
		padding: 15px;
		background-color: white;
		width: 300px !important;
		margin-left: 1%;
		margin-right: 1%;
		/* margin-bottom: 1%; */
		height: 91vh;
		border-radius: 5px;
	}
</style>

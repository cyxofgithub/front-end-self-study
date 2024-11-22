<template>
    <div>
      <el-header>
        <el-button @click="getTheScore(-1)" :class="selectExam ? 'normalbtn' : 'highlightbtn'">全部考试</el-button>
  
        <el-dropdown style="margin-left: 2vw; user-select: none;" trigger="click"
            :class="selectExam ? 'highlightbtn' : 'normalbtn'" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ examTag }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(e, index) in exams" :key='index' :command="index">
              {{ e.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
  
      <el-main>
        <div id="main" style="height:68vh"></div>
      </el-main>
    </div>
  </template>

<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import * as echarts from 'echarts';

const route = useRoute();

const state = reactive({
  exams: [{ id: 0, name: '' }],
  classId: 0,
  className: '',
  selectIndex: -1,
  scoreRange: ['95-100', '90-94', '85-89', '80-84', '70-79', '60-69', '未及格'],
  theNums:[{
                value: 0,
                itemStyle: {
                    color: '#95D475',
                }
            },
            {
                value: 0,
                itemStyle: {
                    color: '#67C23A',
                }
            },
            {
                value: 0,
                itemStyle: {
                    color: '#79BBFF',
                }
            },
            {
                value: 0,
                itemStyle: {
                    color: '#409EFF',
                }
            },
            {
                value: 0,
                itemStyle: {
                    color: '#EEBE77',
                }
            },
            {
                value: 0,
                itemStyle: {
                    color: '#E6A23C',
                }
            },
            {
                value: 0,
                itemStyle: {
                    color: '#EE3737',
                }
            }],
  tmpNum: [],
  examTag: '单次考试',
  selectExam: false,
});

// 替代 created 钩子的初始化逻辑
showpage();

// 替代 mounted 钩子的逻辑
onMounted(() => {
  drawChart();
});


// 替代 watch
watch(() => route.value, showpage);

watch(() => state.tmpNum, (newValue, oldValue) => {
  state.tmpNum = newValue;
  drawChart();
});

watch(() => state.classId, (newValue, oldValue) => {
  state.classId = newValue;
  getExams(state.classId);
  getAllScore();
});

// 定义方法
function getExams(id) {
  axios.get('/exam/getByLesson/' + id)
    .then(res => {
      state.exams = res.data.result;
    })
    .catch(err => {
      console.log(err);
    });
}

function getAllScore() {
  axios.get('/analysis/getAllGradeByLessonId/' + state.classId)
    .then(res => {
      state.tmpNum = res.data.result ? res.data.result.yaxisData : [0, 0, 0, 0, 0, 0, 0];
    })
    .catch(err => {
      console.log(err);
    });
}

function getLessonScore(LessonID) {
  axios.get('/analysis/getAllGradeByExamId/' + LessonID)
    .then(res => {
      state.tmpNum = res.data.result ? res.data.result.yaxisData : [0, 0, 0, 0, 0, 0, 0];
    })
    .catch(err => {
      console.log(err);
    });
}

function getTheScore(index) {
  state.selectIndex = index;
  if (index == -1) {
    getAllScore();
    state.examTag = '单次考试';
  } else {
    getLessonScore(state.exams[index].id);
    state.examTag = state.exams[index].name;
  }
  state.selectExam = (index != -1);
}


function showpage() {
  state.classId = route.query.classId;
  state.className = route.query.className;
  state.selectExam = false;
  state.examTag = '单次考试';
}

function drawChart() {
  for (let index = 0; index < state.tmpNum.length; index++) {
    state.theNums[index].value = state.tmpNum[state.tmpNum.length - 1 - index];
  }

            const myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                xAxis: {
                    data: state.scoreRange.value,
                    axisTick: {
                        show: false
                    }
                },
                yAxis: { show: false },
                series: [
                    {
                        type: 'bar',
                        data: state.theNums.value,
                        label: {
                            show: true,
                            position: 'top',
                            color: 'black',
                            fontSize: 22
                        },
                        itemStyle: {
                            borderRadius: [8, 8, 0, 0]
                        }
                    },
                ]
      })
}

function handleCommand(command) {
  getTheScore(command);
}

</script>


<style scoped>

.highlightbtn {
    background-color: #F5F5F5 !important;
    color: #409EFF;
    padding: 12px 10px;
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
    border: none;
    color: #707070;
    padding: 12px 10px;
    /* padding-left: 0px; */
    text-decoration: none;
    display: inline-block;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
}
</style>

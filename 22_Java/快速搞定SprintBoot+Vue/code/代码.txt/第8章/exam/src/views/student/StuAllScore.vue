<template>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="examList.length !== 0">
      <el-tab-pane label="成绩列表" name="first" >
    
    <div class="sco" v-for="item in examList" >
    <el-col :span="21"><el-card class="sco-card">
    <el-row>
      <span style="color:#ffffff; font-size: 20px; ">{{item.exam.name}}</span>
      &#12288;
      <span style="color:#ffffff; font-size: 14px; ">{{item.exam.lesson?.name}}</span>
      &#12288;
      <span style="color:#ffffff; font-size: 14px; ">{{item.exam.startTime}}-{{item.exam.endTime}}</span>
    </el-row>
    </el-card></el-col>
    <el-col :span="3">
    <el-card class="sco-card">
     <span style="color:#ffffff;
     font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif ; 
     font-size: 24px;
     padding-left: 14px;
     padding-bottom: 20px;">{{item.totalPoint}}</span>
    </el-card>
    </el-col>
    </div>
        </el-tab-pane>
    
      <el-tab-pane label="成绩分布" name="second">
          <el-card>
             <div id="AllScore" :style="{width: '900px', height: '400px'}" />
          </el-card>   
        </el-tab-pane>
    </el-tabs>
      
      <div v-else>
      <el-empty description="暂无成绩"></el-empty>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';

const activeName = ref('first');
const examList = ref([]);
const AllScore = ref({
    xAxis: [],
    series: []
});

const drawLine = () => {
    const myChart = echarts.init(document.getElementById('AllScore'));
    myChart.setOption({
        xAxis: {
            data: AllScore.value.xAxis
        },
        yAxis: {},
        series: [
            {
                type: 'bar',
                data: AllScore.value.series,
                itemStyle: {
                    color: '#95D475',
                    borderType: 'solid',
                    barBorderRadius: 5
                }
            }
        ]
    });
};

const getData = async () => {
    try {
        const resGrade = await axios.get("/grade/getGradeByStudent");
        console.log(resGrade.data.result); 
        examList.value = resGrade.data.result;
        const resAnalysis = await axios.get("/analysis/getStudentGradeByNum");
        AllScore.value.xAxis = resAnalysis.data.result.label;
        AllScore.value.series = resAnalysis.data.result.yaxisData;
    } catch (err) {
        console.error(err);
    }
};

onMounted(() => {
    getData();
});

const handleClick = (tab, event) => {
    drawLine();
};
</script>


<style scoped>
.sco-card{
  background-color: rgb(149, 212, 117);
  margin-right: 10px;
  margin-top: 5px;
  height:50px;

  padding-bottom: 12px;

}

</style>
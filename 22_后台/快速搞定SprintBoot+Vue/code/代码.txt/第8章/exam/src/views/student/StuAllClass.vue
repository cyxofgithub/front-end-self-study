<template>
    <div>
    <el-button class="addbtn" type="success" @click="changeOuterVisible">加入班级</el-button>
    <el-dialog title="加入班级" v-model="outerVisible">
    
    <el-form :model="form" ref="formRef">
        <el-form-item label="班级代码" prop="uuid"
        :rules="[
        {required:true,message:'请输入班级代码',trigger:'blur'},
      ]">
        <el-input v-model="form.uuid" autocomplete="off"></el-input>
        </el-form-item>
        </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd(form)">确定加入</el-button>
    </div>
    </el-dialog>
    
    <div v-if="classList!==null">
    <el-row :gutter="12">
            <el-col :span="8" v-for="(item,index) in classList" :key="index">
                <el-card class="box-card" shadow="hover">
    
            <div slot="header" class="clearfix">
                <el-button type="text"
                style="font-size: 18px;
                font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                color:black;"
                @click="handleLesson(item.lesson.id,index)">{{item.lesson.name}}</el-button>
    
            </div>
    
            <div class="text item">班级老师：{{item.lesson.teacher.name}}</div>
            <div class="text item">班级人数：{{item.lesson.count}}</div>
    
    
            <el-table :data="[item]" border style="width: 100%">
                <el-table-column prop="notStartedCount" label="时间未到" align="center"></el-table-column>
                <el-table-column prop="finishedCount" label="已结束" align="center"></el-table-column>
                <el-table-column prop="markedCount" label="已批阅" align="center"></el-table-column>
            </el-table>
            </el-card>
    </el-col>
    </el-row>
    </div>
    <div v-else>
        <el-empty description="暂无班级，请点击加入班级"></el-empty>
    </div>
    
    
        <el-dialog title="我的班级" :visible.sync="dialogVisible"
                   class="dialog"
                   customClass="customWidth">
    
            <div class="btn_switch">
                <button class="btn_anniu" @click="changeTable(0,index)"
                        :class="{ newStyle:0===tableNumber}">所有考试</button>
                <button class="btn_anniu" @click="changeTable(1,index)"
                        :class="{ newStyle:1===tableNumber}">成绩统计</button>
            </div>
    
            <div class="dialogDiv">
                <div v-if="0===tableNumber">
                    <el-table ref="filterTable" :data="tableData2" style="width: 100% "
                              :row-style="{height: '70px'}" :row-class-name="tableRowClassName">
                        <el-table-column prop="name" label="考试科目" align="center"></el-table-column>
                        <el-table-column prop="startTime" label="考试开始时间" align="center"></el-table-column>
                        <el-table-column prop="endTime" label="考试结束时间" align="center"></el-table-column>
                        <el-table-column prop="status" label="考试状态" align="center"
                                         :filters="[{ text: '正在考试', value: '正在考试' }, { text: '时间未到', value: '时间未到' },{ text: '已结束', value: '已结束' },{ text: '已批阅', value: '已批阅' }]"
                                         :filter-method="filterStatus" filter-placement="bottom-end">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status !== '正在考试'"
                                        :type="scope.row.status === '时间未到' ? 'success' : 'info'"
                                        disable-transitions>{{scope.row.status}}
                                </el-tag>
                                <el-tag v-if="scope.row.status === '正在考试'" type="danger">正在考试</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
    
                <div v-if="1===tableNumber" lazy style="display: flex;">
                    <div class="grid-content" style="width: 50%;">
                        <div class="charts" id="chart1" :style="{width: '400px', height: '300px'}" />
                    </div>
    
                    <div class="grid-content" style="width: 50%;">
                        <div class="charts" id="chart2" :style="{width: '400px', height: '350px'}" />
                    </div>
                </div>
    
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

const index = ref(0);
const dialogTableVisible = ref([]);
const dialogVisible = ref(false);
const activeName = ref('first');
const tableNumber = ref(0);
const outerVisible = ref(false);
const form = reactive({
    uuid: ''
});
const formRef = ref(null);
const tableData2 = ref([]);
const classList = ref([]);

const chart1 = reactive({
    xAxis: [],
    series: []
});
const chart2 = reactive({
    indicator: [],
    value: []
});

const getClass = async () => {
    try {
        const res = await axios.get("/lesson/getLessonListByStudentId");
        classList.value = res.data.result;
        console.log(classList.value);
    } catch (error) {
        console.error(error);
    }
};

const handleAdd =  () => {

    const valid = formRef.value.validate();
    if (valid) {
        submitClass();
        outerVisible.value = false;
    } else {
        return false;
    }
};

const submitClass = async () => {
    try {
        const res = await axios({
            method: 'post',
            url: '/lesson/join',
            params: {
                uuid: form.uuid
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (res.data.code === "200") {
            ElMessage({
                message: res.data.message,
                type: 'success'
            });
            await getClass();
        } else {
            ElMessage({
                message: res.data.message,
                type: 'info'
            });
        }
    } catch (err) {
        console.error(err);
    }
};

const getGradeByClass1 = async (classId) => {
    try {
        const res = await axios.get('/analysis/getGradeTrend?lessonId=' + classId);
        chart1.xAxis = res.data.result.label;
        chart1.series = res.data.result.yaxisData;
        drawLine1(); // 确保 drawLine1 函数已定义
    } catch (err) {
        console.error(err);
    }
};

const getGradeByClass2 = async (classId) => {
    try {
        const res = await axios.get('/analysis/getRadarByStudentIdAndLessonId/' + classId);
        chart2.indicator = res.data.result.label;
        chart2.value = res.data.result.yaxisData;
        drawLine2(); // 确保 drawLine2 函数已定义
    } catch (err) {
        console.error(err);
    }
};


const handleLesson = async (id, index) => {
    dialogVisible.value = true;
    lessonId.value = id;
    try {
        const res = await axios.get('/exam/getByLesson/' + id);
        console.log(res.data.result);
        tableData2.value = res.data.result;
        changeTable(0, 0);
    } catch (err) {
        console.error(err);
    }
};

const changeOuterVisible = () => {
    outerVisible.value = true;
    console.log(outerVisible.value);
};

const clearFilter = () => {
    if (filterTable.value) {
        filterTable.value.clearFilter();
    }
};

const filterStatus = (value, row) => {
    return row.status === value;
};

const changeTable = (index, no) => {
    console.log(lessonId.value);
    tableNumber.value = index;
    if (index === 1) {
        nextTick(() => {
            console.log(lessonId.value);
            getGradeByClass1(lessonId.value);
            getGradeByClass2(lessonId.value);
        });
    }
};

const drawLine1 = () => {
    const chartDom = document.getElementById('chart1');
    if (chartDom) {
        const chart1 = echarts.init(chartDom);
        chart1.setOption({
            title: {
                text: '分数走势',
                textStyle: {
                    fontSize: 14
                }
            },
            xAxis: {
                type: 'category',
                data: chart1Data.xAxis
            },
            yAxis: {
                type: 'value'
            },
            legend: {
                orient: "vertical",
                x: 'middle',
                y: 'middle',
            },
            series: [{
                data: chart1Data.series,
                type: 'line',
                lineStyle: {
                    normal: {
                        color: 'green',
                        type: 'dashed'
                    }
                }
            }]
        });
    }
};

const drawLine2 = () => {
    const chartDom = document.getElementById('chart2');
    if (chartDom) {
        const chart2 = echarts.init(chartDom);
        chart2.setOption({
            title: {
                text: '知识点掌握程度',
                textStyle: {
                    fontSize: 14
                }
            },
            legend: {
                data: ['Allocated Budget'],
                itemHeight: 9,
                itemWidth: 9,
                textStyle: {
                    fontSize: 10
                }
            },
            radar: {
                indicator: chart2Data.indicator
            },
            series: [{
                name: 'Budget vs spending',
                type: 'radar',
                data: [{
                    value: chart2Data.value
                }]
            }]
        });
    }
};


watch(classList, (newValue, oldValue) => {
    classList.value = newValue;
    if (classList.value !== null) {
        const thisLength = classList.value.length;
        for (let i = 0; i < thisLength; i++) {
            dialogTableVisible.value.push({ isOpen: false });
        }
    }
});

onMounted(() => {
    getClass();
});
</script>



<style>
	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 5px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.btn_anniu {
		width: 50%;
		padding: 20px 0;
		font-size: 15px;

		border: 0 solid #fff;
		color: rgb(193, 193, 193);
		outline: none;
		background: #fff;
	}

	.newStyle {
		border-bottom: 2px solid #000000;
		color: rgb(0, 0, 0);
		font-size: 15px;

	}

	.el-row {
		margin-bottom: 20px;
	}

	.el-col {
		border-radius: 4px;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}


	.dialogDiv {
		height: 360px;
		overflow: auto;
	}

	.customWidth {
		width: 80%;
	}

	.addbtn {
		margin-bottom: 10px;
	}

	.box-card{
		margin-top: 6px;

	}
</style>


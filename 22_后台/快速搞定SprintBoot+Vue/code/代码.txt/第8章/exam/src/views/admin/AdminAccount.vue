<template>
    <div id="account">
        <el-header class="headerDiv">

            <button :class="selectChara == 'Student' ? 'highlightbtn' : 'normalbtn'"
                @click="changeChara(1)">学生审核</button>
            <button :class="selectChara == 'Teacher' ? 'highlightbtn' : 'normalbtn'"
                @click="changeChara(2)">教师审核</button>

            <div style="flex-grow: 1;"></div>

            <div>
                <el-dropdown style="user-select: none;" trigger="click" @command="handleCommand">
                    <span class="highlight">
                        {{ this.selectTag }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="e, index in this.states" :key='index' :command="index">
                            {{ e }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

        </el-header>
        <el-main style="background-color:white">

            <el-table :data="(selectChara == 'Student') ? studentData : teacherData" border style="width: 100%"
                height="485" :key="num">

                <el-table-column prop="createTime" label="日期">
                </el-table-column>

                <el-table-column prop="name" label="姓名">
                </el-table-column>

                <el-table-column prop="id" :label="(selectChara == 'Student') ? '学号' : '职工号'">
                </el-table-column>


                <el-table-column label="操作" width="160">
                    <template v-slot="handle">
                        <el-button type="text" size="small" :disabled="handle.row.certified == '通过'"
                            @click="certifyChara(true, handle.row.id, handle.$index)">通过</el-button>
                        <el-button type="text" size="small" :disabled="handle.row.certified == '未通过'"
                            @click="certifyChara(false, handle.row.id, handle.$index)">拒绝</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="80">
                    <template v-slot="scope">
                        <el-tag type="success" v-if="scope.row.certified == '通过'">{{ scope.row.certified }}</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.certified == '审核中'">{{ scope.row.certified }}</el-tag>
                        <el-tag type="danger" v-else>{{ scope.row.certified }}</el-tag>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination style="margin-top: 2vh;" @current-change="handleCurrentChange" background
                layout="prev, pager, next" :total="this.totalPages * 10">
            </el-pagination>
        </el-main>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const studentData = ref([{
    createTime: '',
    name: '',
    id: '',
    certified: '',
    imageUrl: ''
}]);
const teacherData = ref([{
    createTime: '',
    name: '',
    id: '',
    certified: '',
    imageUrl: ''
}]);
const selectChara = ref('Student');
const selectTag = ref('全部');
const totalPages = ref(0);
const states = ['全部', '通过', '审核中', '未通过'];
const num = ref(0);

const getAllInfo = async (i) => {
    try {
        const res = await axios({
            url: '/admin/getAll' + selectChara.value,
            method: 'get',
            params: {
                index: i,
                pageSize: 10
            }
        });
        if (selectChara.value === 'Student') {
            studentData.value = res.data.result.records;
        } else {
            teacherData.value = res.data.result.records;
        }
        totalPages.value = res.data.result.pages;
    } catch (err) {
        console.error(err);
    }
};

const getDistinguishInfo = async (index, certify) => {
    if (certify === '全部') {
        await getAllInfo(index);
    } else {
        try {
            const res = await axios({
                url: '/admin/getAll' + selectChara.value + 'ByCertified',
                method: 'get',
                params: {
                    certified: certify,
                    index: index,
                    pageSize: 10
                }
            });
            if (selectChara.value === 'Student') {
                studentData.value = res.data.result.records;
            } else {
                teacherData.value = res.data.result.records;
            }
            totalPages.value = res.data.result.pages;
        } catch (err) {
            console.error(err);
        }
    }
};

const handleCurrentChange = (val) => {
    getDistinguishInfo(val, selectTag.value);
};

const handleCommand = (command) => {
    const status = states[command];
    selectTag.value = status;
    getDistinguishInfo(1, status);
};

const certifyChara = async (state, id, index) => {
    let Charact = (selectChara.value === 'Student') ? 'student' : 'teacher';
    try {
        const res = await axios({
            url: '/admin/' + Charact + 'Certify',
            method: 'post',
            params: {
                certified: state,
                id: id
            }
        });
        if (Charact === 'teacher') {
            teacherData.value[index].certified = res.data.result.certified;
        } else {
            studentData.value[index].certified = res.data.result.certified;
        }
    } catch (err) {
        console.error(err);
    }
};

const changeChara = (index) => {
    selectChara.value = (index === 1) ? 'Student' : 'Teacher';
    selectTag.value = '全部';
    getAllInfo(1);
};

onMounted(() => {
    getAllInfo(1);
});
</script>
<style scoped>
.headerDiv {
    display: flex; 
    align-items: baseline;
}

.highlight {
    background-color: #F5F5F5 !important;
    color: #409EFF;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
}

.highlightbtn {
    background-color: #F5F5F5 !important;
    color: #409EFF;
    padding: 12px 10px;
    border: none;
    text-decoration: none;
    display: inline-block;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
}

.normalbtn {
    background-color: #F5F5F5 !important;
    border: none;
    color: #707070;
    padding: 12px 10px;
    text-decoration: none;
    display: inline-block;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
}
</style>

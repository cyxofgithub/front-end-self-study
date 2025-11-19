<template>
    <div id="ques">
        <el-header>
            <div style="display: flex; align-items: baseline;">
                <span>系统题库</span>
                <div style="flex-grow: 1;"></div>
                <div>
                    <el-dropdown style="user-select: none;" trigger="click" @command="handleCommand">
                        <span class="highlight">
                            {{ this.selectTag }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="e, index in this.subjects" :key='index' :command="index">
                                {{ e }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <el-main>
            <div style="height:60vh">
                <ul>
                    <li v-for="i in questions" class="quesArea">
                        <span v-html="i.type"></span>
                        <p v-html="i.content"></p>
                        <p v-for="j in i.choose" v-if="i.choose?.length !== 0" v-html="j"></p>
                        <button class="answer" @click="showDialog(i.answer,i.analysis)">查看答案</button>
                    </li>
                        <el-dialog title="答案" :visible.sync="dialogVisible" width="50%">
                            <span>答案：</span>
                            <p v-html="this.showAnswer"></p>
                        </el-dialog>
                </ul>
            </div>
        </el-main>

        <div style="margin-top:3vh">
            <button :class="theIndex == 1 ? 'disableBtn' : 'TheBtn'" @click="subPages">
                <el-icon><ArrowLeft /></el-icon>
                </button>
            <span style="margin-left:1vw">{{ theIndex }}</span>
            <button class="TheBtn" style="margin-left:1vw" @click="addPages">
                <el-icon><ArrowRight /></el-icon>
                </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const subjects = ['语文', '数学', '英语', '政治', '物理', '化学', '生物', '地理', '历史'];
const enSubjects = ['Chinese', 'Math', 'English', 'Politics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History'];
const selectSubject = ref(0);
const theIndex = ref(1);
const selectTag = ref('语文');
const questions = ref([{
    content: '',
    answer: '',
    analysis: '',
    knowledge: '',
    type: '',
    choose: [''],
}]);
const dialogVisible = ref(false);
const showAnswer = ref('');
const showAnalysis = ref('');

const getQuestions = () => {
    axios({
        url: '/question/getAll',
        method: 'get',
        params: {
            index: theIndex.value,
            pageSize:10
        }
    }).then(res => {
        questions.value = res.data.result.records;
        questions.value.forEach(question => {
            question.choose = JSON.parse(question.choose);
        });
    }).catch(err => {
        console.error(err);
    });
};

const handleCommand = (command) => {
    selectSubject.value = command;
    selectTag.value = subjects[selectSubject.value];
    theIndex.value = 1;
    getQuestions();
};

const showDialog = (answer, analysis) => {
    dialogVisible.value = true;
    showAnswer.value = answer;
    showAnalysis.value = analysis;
};

const subPages = () => {
    theIndex.value -= 1;
    getQuestions();
};

const addPages = () => {
    theIndex.value += 1;
    getQuestions();
};

onMounted(() => {
    getQuestions();
});
</script>



<style scoped>
.answer {
    color: #409EFF;
    background-color: white;
    border: none;
    cursor: pointer;
    text-decoration: none;
    user-select: none;
}

.TheBtn {
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

.TheBtn:hover {
    opacity: 0.8;
}

.TheBtn:active {
    opacity: 1;
    background-color: #3897f7;
}

.disableBtn {
    align-self: center;
    color: white;
    background-color: #409EFF;
    border: none;
    font-size: 16px;
    padding: 10px 28px;
    border-radius: 6px;
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
    display: inline-block;
    text-decoration: none;
}

.quesArea {
    border: 1px solid #707070;
    margin-bottom: 1vh;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
}
</style>
<template>
    <div class="home-container" >
       <!-- 头部区域 -->
	   <TopHeader :username="teaName"></TopHeader>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside class="leftaside">
                <div v-for="(item, index) in classList" :key="index" class="btndiv">
                    <button :class="index === classchoosen ? 'highlightbtn' : 'normalbtn'"
                        @click="changeclass(index, item.id)">
                        <i :class="item.icon + ' el-icon--left'"></i>{{ item.name }}
                    </button>
                </div>
                <div class="btnbottom">
                    <button class="newBtn" @click="classCreate">新建班级</button>
                </div>

                <el-dialog title="创建班级" v-model="dialogFormVisible" width="500px">
                    <el-form :model="newClassForm" :rules="newClassRules" style="width: 400px;" ref="newClassFormRef">
                        <el-form-item label="班级名称" :label-width="formLabelWidth" prop="newClassName">
                            <el-input v-model="newClassForm.newClassName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="科目选择" :label-width="formLabelWidth">
                            <el-select v-model="newClassForm.newClassSubject" placeholder="请选择科目">
                                <el-option v-for="item in subjectList" :key="item.id" :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="classCreateEnter(newClassForm)">确 定</el-button>
                    </div>
                </el-dialog>

            </el-aside>
            <el-aside class="rightaside">
                <div v-for="(item, index) in pageList" :key="index" class="btndiv">
                    <button :class="index === pagechoosen ? 'highlightbtn' : 'normalbtn'"
                        @click.prevent="materTay(index)">
                        <i :class="item.icon + ' el-icon--left'"></i>{{ item.pageValue }}
                    </button>
                </div>
            </el-aside>
            <!-- 右侧内容主题 -->
            <el-main style="height: 85vh;">
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';
import TopHeader from './TopHeader.vue';
const router = useRouter();

const teaId = ref('');
const teaName = ref('');
const classList = ref([{ id: 0, name: '' }]);
const pageList = ref([{
						icon: 'el-icon-school',
						page: 'classinfo',
						pageValue: '班级信息'
					},
					{
						icon: 'el-icon-notebook-2',
						page: 'classallexam',
						pageValue: '全部试卷'
					},
					{
						icon: 'el-icon-edit-outline',
						page: 'correctlist',
						pageValue: '试卷批改'
					},
					{
						icon: 'el-icon-data-analysis',
						page: 'classscore',
						pageValue: '成绩统计'
					},
					{
						icon: 'el-icon-document',
						page: 'teacherinfo',
						pageValue: '个人题库'
					},
				]);
const newClassForm = ref({
    newClassName: '',
    newClassSubject: 1,
});
const newClassFormRef = ref(null)
const subjectList = ref([{ id: 1, name: "科目一" }]);
const newClassRules = ref({
					
					newClassName: [{
							required: true,
							message: "请输入班级名",
							trigger: "blur"
						},
						{
							min: 3,
							max: 10,
							message: "长度在 3 到 10 个字符之间",
							trigger: "blur",
						},
					],
				});
const classchoosen = ref(0);
const pagechoosen = ref(0);
const dialogFormVisible = ref(false);
const formLabelWidth = '120px';

watch(classList, (newValue, oldValue) => {
    showpage();
});

const getCookies = () => {
    teaId.value = Cookies.get("id");
    teaName.value = Cookies.get("name");
};

const changeclass = (chosen, id) => {
    classchoosen.value = chosen;
    showpage();
};

const materTay = (chosen) => {
    pagechoosen.value = chosen;
    showpage();
};

const getClasses = async () => {
    try {
        const res = await axios.get('/lesson/getLessonByTeacherId');
        classList.value = res.data.result;
    } catch (err) {
        console.error(err);
    }
};

const showpage = () => {
    if (classList.value && classList.value.length > 0 && classList.value[classchoosen.value]) {
        router.push({
            path: pageList.value[pagechoosen.value].page,
            query: {
                classId: classList.value[classchoosen.value].id,
                className: classList.value[classchoosen.value].name
            }
        });
    }
};


const getSubjectList = async () => {
    try {
        const res = await axios.get('/question/getSubjectList');
        subjectList.value = res.data.result;
    } catch (err) {
        console.error(err);
    }
};

const classCreate = () => {
    dialogFormVisible.value = true;
};

const classCreateEnter = async () => {
    const valid = await newClassFormRef.value.validate();
    if (valid) {
        dialogFormVisible.value = false;
        await submitClass();
    } else {
        return false;
    }
};

const submitClass = async () => {
    try {
        const res = await axios({
            method: 'post',
            url: '/lesson/addLesson',
            params: {
                name: newClassForm.value.newClassName,
                subjectId: newClassForm.value.newClassSubject,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        ElMessage({
            message: '恭喜你，创建成功',
            type: 'success'
        });
        await getClasses();
    } catch (err) {
        console.error(err);
    }
};

getClasses();
getCookies();
getSubjectList();
</script>
<style scoped>
	.home-container {
		height: 100%;
		background-color: #F5F5F5;
	}

	.header {
		height: 80px !important;
	}

	.headFont {
		display: flex;
		padding: 5px;
		/* height: 100%; */
		margin-left: 18%;
		margin-right: 3%;
		align-items: baseline;
	}

	.leftaside {
		background-color: white;
		width: 200px !important;
		margin-left: 1%;
		margin-right: 1%;
		margin-bottom: 1%;
		position: relative;
		border-radius: 5px;
	}

	.rightaside {
		background-color: white;
		width: 200px !important;
		margin-right: 1%;
		margin-bottom: 1%;
		position: relative;
		border-radius: 5px;
	}

	.btnbottom {
		margin-left: auto;
		margin-right: auto;
		position: absolute;
		left: 20px;
		bottom: 10px;
		width: 80%;
		display: flex;
	}

	.newBtn {
		width: 100%;
		background-color: #409EFF !important;
		color: #FFFFFF !important;
		padding: 12px 10px;
		/* padding-left: 0px; */
		border: none;
		text-decoration: none;
		display: inline-block;
		font-size: 18px;
		font-weight: bold;
		border-radius: 5px;
	}

	.btndiv {
		margin-left: auto;
		margin-right: auto;
		width: 80%;
		display: flex;
		margin-top: 12px;
	}

	.highlightbtn {
		width: 100%;
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
		width: 100%;
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

	.choosebtn {}

	.leftmenu {
		border-right: 0;
	}

	.el-main {
		background-color: white;
		border-radius: 5px;
		margin-right: 1%;
		margin-bottom: 1%;
	}

	.iconfont {
		margin-right: 10px;
	}
</style>

<template>
	<div style="height:83vh">
		<el-button class="addbtn" style="float: right;" type="primary" @click="dialogVisible=true">添加题目</el-button>

		<el-dialog title="添加题目" v-model="dialogVisible" width="50%" :before-close="handleClose">
			<div style="display: flex; align-items: center;">
				<div style="width: 130px;text-align: right;margin-right: 10px;"> 选择题型：</div>
				<el-radio-group v-model="itemType">
					<el-radio-button label="单选题"></el-radio-button>
					<el-radio-button label="多选题"></el-radio-button>
					<el-radio-button label="填空题"></el-radio-button>
					<el-radio-button label="简答题"></el-radio-button>
				</el-radio-group>
			</div>

			<div style="display: flex; align-items: center;margin-top: 20px;">
				<div style="width: 130px;text-align: right;margin-right: 10px;"> 选择课程及知识点：</div>
				<el-cascader v-model="knowledgePointId" :options="options" :props="props" @change="handleChange">
				</el-cascader>
			</div>

			<div style="display: flex; align-items: center;margin-top: 20px;">
				<div style="width: 130px;text-align: right;margin-right: 10px;"> 题目标题：</div>
				<el-input type="textarea" autosize placeholder="请输入内容" v-model="itemLabel" style="width: 450px;"
					:autosize="{ minRows: 2,}">
				</el-input>
			</div>

			<div v-if="itemType=='单选题'">
				<div style="display: flex; align-items: center;margin-top: 20px;">
					<div style="width: 130px;text-align: right;margin-right: 10px;"> 答案选项：</div>
					<div>
						<div class="flex" v-for="o in radioAnswers" :key="o.no" style="margin-top: 5px;">
							<el-input v-model="o.answer" placeholder="请输入内容" style="width: 300px;">
							</el-input>
							<el-radio v-model="radioCorrectAnswer" :label="o.no" border
								style="margin-left: 10px;margin-right: 10px;">正确答案</el-radio>
							<i class="el-icon-remove-outline" style="color: #707070;"
								@click="removeRadioAnswer(o.no)"></i>
							<i class="el-icon-circle-plus-outline" style="margin-left: 10px; color: #707070;"
								@click="addRadioAnswer(o.no)"></i>
						</div>
					</div>
				</div>
			</div>
            <div v-if="itemType=='多选题'">
				<div style="display: flex; align-items: center;margin-top: 20px;">
					<div style="width: 130px;text-align: right;margin-right: 10px;"> 答案选项：</div>
					<div>
						<div class="flex" v-for="o in checkAnswers" :key="o.no" style="margin-top: 5px;">
							<el-input v-model="o.answer" placeholder="请输入内容" style="width: 300px;">
							</el-input>
							<el-checkbox v-model="checkCorrectAnswer" :label="o.no" border
								style="margin-left: 10px;margin-right: 10px;">正确答案</el-checkbox>
							<i class="el-icon-remove-outline" style="color: #707070;"
								@click="removeCheckAnswer(o.no)"></i>
							<i class="el-icon-circle-plus-outline" style="margin-left: 10px; color: #707070;"
								@click="addCheckAnswer(o.no)"></i>
						</div>
					</div>
				</div>
			</div>

			<div v-if="itemType=='填空题'">
				<div style="display: flex; align-items: center;margin-top: 20px;">
					<div style="width: 130px;text-align: right;margin-right: 10px;"> 填空答案：</div>
					<div>
						<div class="flex" v-for="(o,index) in completionAnswers" :key="index" style="margin-top: 5px;">
							<el-input v-model="completionAnswers[index]" placeholder="请输入内容" style="width: 300px;">
							</el-input>

							<i class="el-icon-circle-plus-outline" style="margin-left: 10px; color: #707070;"
								@click="addCompletionAnswer(index)"></i>
							<i class="el-icon-remove-outline" style="margin-left: 10px; color: #707070;"
								@click="removeCompletionAnswer(index)" v-if="completionMaxNo==index"></i>
						</div>
					</div>
				</div>
			</div>

			<div v-if="itemType=='简答题'">
				<div style="display: flex; align-items: center;margin-top: 20px;">
					<div style="width: 130px;text-align: right;margin-right: 10px;"> 简答答案：</div>
					<div>
						<el-input type="textarea" autosize placeholder="请输入内容" v-model="shortAnswerAnswers"
							style="width: 450px;" :autosize="{ minRows: 2,}">
						</el-input>
					</div>
				</div>
			</div>

			<span slot="footer" class="dialog-footer footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="onSubmit">立即创建</el-button>
			</span>
		</el-dialog>

        <el-table :data="tableData" border style="width: 100%">
			<el-table-column fixed="left" label="操作" width="80" align="center">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="id" label="NO" width="60" align="center"></el-table-column>
			<el-table-column prop="type" label="题型" width="100" align="center"></el-table-column>
			<el-table-column prop="knowledgePoint" label="知识点" width="140" align="center"></el-table-column>
			<el-table-column prop="stem.itemLabel" label="题干" align="center"></el-table-column>
		</el-table>

		<el-dialog title="题目详情" :visible.sync="centerDialogVisible" width="50%" center>
			<div style="margin-top:5px">题型：{{dialog.type}}</div>
			<div style="margin-top:5px">知识点：{{dialog.knowledgePoint}}</div>
			<div style="margin-top:5px; margin-bottom: 5px;">题干：{{dialog.itemLabel}}</div>
			<span style="margin-right:10px;" v-for="answer in dialog.answerArray">{{answer.no}}.{{answer.answer}}</span>
			<div style="margin-top:5px">答案：{{dialog.answer}}</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>

		<div class="block">
			<el-pagination align="center" style="margin: 8px" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" :current-page="currentpage" :page-sizes="pagesizes"
				:page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

	</div>
</template>
<script setup>
import axios from 'axios';
import { ref, reactive } from 'vue';
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const route = useRoute()
const itemType = ref("单选题");
const itemLabel = ref("这里是题干模板");
//单选
const radioAnswers = ref([{
					no: 0,
					answer: "选项一",
				}, {
					no: 1,
					answer: "选项二",
				}]);
const radioCorrectAnswer = ref(0);
const radioMaxNo = ref(1);
//多选
const checkAnswers = ref([{
					no: 0,
					answer: "选项一",
				}, {
					no: 1,
					answer: "选项二",
				}, {
					no: 2,
					answer: "选项三",
				}]);
const checkCorrectAnswer = ref([0, 1]);
const checkMaxNo = ref(2);

const completionAnswers = ref(["填空答案一"]);
const completionMaxNo = ref(0);

const shortAnswerAnswers = ref('');

const knowledgePointId = ref('');
const question = reactive({stem:{}});
const InitialQuestion = reactive({});

const centerDialogVisible = ref(false);
const dialogVisible = ref(false);
const tableData = ref([]);
const dialog = ref([]);

const currentpage = ref(1); // 当前页数
const pagesize = ref(5); // 每页的数量
const pagesizes = ref([5, 10, 15]); // 可选的每页数量
const total = ref(1); // 总数据量
const classId = ref(0)
const className = ref('')

const props = reactive({
  expandTrigger: 'hover',
  label: 'name',
  value: 'id',
  children: 'knowledgePointList'
});
const options = ref([]);

// showpage 方法
const showpage = () => {
  classId.value = route.query.classId;
  className.value = route.query.className;
};


// 监听路由变化
watch(() => route.query, showpage);



const initQuestion = () => {
  question.knowledgePointId = knowledgePointId.value[1];
  question.stem.itemLabel = itemLabel.value;

  switch (itemType.value) {
    case "单选题":
      question.type = "单选题";
      question.answer = radioCorrectAnswer.value.toString();
      question.stem.answerArray = radioAnswers.value;
      break;
    case "多选题":
      question.type = "多选题";
      question.answer = checkCorrectAnswer.value.toString();
      question.stem.answerArray = checkAnswers.value;
      break;
    case "填空题":
      question.type = "填空题";
      question.answer = completionAnswers.value.toString();
      break;
    case "简答题":
      question.type = "简答题";
      question.answer = shortAnswerAnswers.value.toString();
      break;
    default:
      // 默认情况的处理
      break;
  }

  question.stem = JSON.stringify(question.stem);
};


const onSubmit = async () => {
  initQuestion();

  try {
    const res = await axios.post('/question/postQuestion', question);
    ElMessage({
      message: '恭喜你，创建成功',
      type: 'success'
    });
    dialogVisible.value = false;
    question.value = InitialQuestion;
    getData();
  } catch (err) {
    console.error(err);
  }
};


const handleSizeChange = (val) => {
  currentpage.value = 1;
  pagesize.value = val;
  getData();
};

const handleCurrentChange = (val) => {
  currentpage.value = val;
  getData();
};

const handleClick = (row) => {
  dialog.type = row.type;
  dialog.knowledgePoint = row.knowledgePoint;
  dialog.itemLabel = row.stem.itemLabel;
  dialog.answerArray = row.stem.answerArray;
  dialog.answer = row.answer;
  centerDialogVisible.value = true;
};

const getData = async () => {
  tableData.value = [];
  
  try {
    const response = await axios.get(`/question/getByTeacher?index=${currentpage.value}&pageSize=${pagesize.value}`);
    response.data.result.records.forEach(record => {
      const obj = JSON.parse(record.stem);
      tableData.value.push({
        id: record.id,
        type: record.type,
        knowledgePoint: record.knowledgePoint.name,
        stem: obj,
        answer: record.answer,
      });
    });
    total.value = response.data.result.total;

    const optionsResponse = await axios.get("/question/getKnowledgePointList");
    options.value = optionsResponse.data.result;
  } catch (error) {
    console.error(error);
  }
};

const addRadioAnswer = (no) => {
  const existingAnswer = radioAnswers.value.find(answer => answer.no === no);
  if (existingAnswer) {
    const newAnswer = {
      no: ++radioMaxNo.value,
      answer: existingAnswer.answer,
    };
    radioAnswers.value.push(newAnswer);
  }
};

const addCheckAnswer = (no) => {
  const existingAnswer = checkAnswers.value.find(answer => answer.no === no);
  if (existingAnswer) {
    const newAnswer = {
      no: ++checkMaxNo.value,
      answer: existingAnswer.answer,
    };
    checkAnswers.value.push(newAnswer);
  }
};

const addCompletionAnswer = (index) => {
  const newAnswer = JSON.parse(JSON.stringify(completionAnswers.value[index]));
  completionAnswers.value.push(newAnswer);
  completionMaxNo.value++;
};

const removeRadioAnswer = (no) => {
  if (radioAnswers.value.length > 1) {
    const index = radioAnswers.value.findIndex(answer => answer.no === no);
    if (index !== -1) {
      radioAnswers.value.splice(index, 1);
    }
    radioCorrectAnswer.value = radioAnswers.value[0]?.no || 0;
  }
};

const removeCheckAnswer = (no) => {
  if (checkAnswers.value.length > 2) {
    const index = checkAnswers.value.findIndex(answer => answer.no === no);
    if (index !== -1) {
      checkAnswers.value.splice(index, 1);
    }
    if (checkAnswers.value.length > 1) {
      checkCorrectAnswer.value = [checkAnswers.value[0].no, checkAnswers.value[1].no];
    }
  }
};

const removeCompletionAnswer = (index) => {
  if (index >= 1 && completionAnswers.value.length > index) {
    completionAnswers.value.splice(index, 1);
    completionMaxNo.value--;
  }
};
showpage();
getData();

</script>

<style>
	textarea {
		/* //font-family: Arial, Helvetica, sans-serif;
		//修改点[1] */
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	}

	.flex {
		display: flex;
		align-items: center;
	}

	.radio {
		width: 8px !important;
		height: 8px;
		border-radius: 50%;
		border: 1px solid #3089DC;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.radiosmall {
		width: 6px;
		height: 6px;
		background-color: #3089DC;
		border-radius: 50%;
	}

	
</style>


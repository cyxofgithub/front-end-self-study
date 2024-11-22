<template>
	<el-container class="home-container">
	  <el-header class="header">
		<div style="height: 100%; display: flex; align-items: center;">
		  <el-button type="info" @click="backToMain">返回</el-button>
		  <div style="flex-grow: 1;"></div>
		  <el-button @click="submitExam" type="success">确认创建</el-button>
		</div>
	  </el-header>
	  <el-container>
		<el-aside class="leftaside">
			<div style="text-align: center;font-size: large;font-weight: bold;">
					选择您要添加的题目
				</div>
				<div style="margin-top: 20px;display: flex;">
					<div style="flex-grow: 3;"></div>
					<el-checkbox v-model="subject[0].checkState" :label="subject[0].label"
						@change="checked=>handleCheckChange(checked,subject[0])" border></el-checkbox>
					<div style="flex-grow: 1;"></div>
					<el-checkbox v-model="subject[1].checkState" :label="subject[1].label"
						@change="checked=>handleCheckChange(checked,subject[1])" border></el-checkbox>
					<div style="flex-grow: 3;"></div>
				</div>
				<div style="margin-top: 20px;display: flex;">
					<div style="flex-grow: 3;"></div>
					<el-checkbox v-model="subject[2].checkState" :label="subject[2].label"
						@change="checked=>handleCheckChange(checked,subject[2])" border></el-checkbox>
					<div style="flex-grow: 1;"></div>
					<el-checkbox v-model="subject[3].checkState" :label="subject[3].label"
						@change="checked=>handleCheckChange(checked,subject[3])" border></el-checkbox>
					<div style="flex-grow: 3;"></div>
				</div>
				<div style="margin-top: 20px;text-align: center;">
					添加题目后 可在下方调整题型顺序
				</div>
				<div style="margin-top: 20px;margin-left: 10px;margin-right: 10px;text-align: center;">
					<draggable v-model="myArray" chosen-class="subArrayChosen" @start="onStart" @end="onEnd"
						animation="600">
						<template #item="{item}">
						<transition-group>
							<div class="subArray" v-for="item in myArray" :key="item.id">{{item.name}}</div>
						</transition-group>
						</template>
					</draggable>
				</div>		
			</el-aside>

			<el-main>
				<div style="display: flex;">
				<div style="flex-grow: 11">
					<input v-model="paperName" type="text" id="fname" name="fname" placeholder="考试名称">
					<content-edit v-model='paperDescribe' style="margin-left: 2px;"></content-edit>
				</div>
				<div style="flex-grow: 1; background-color: #67C23A; border-radius: 5px; color: white; text-align: center; padding: 10px;">
					<div>总分</div>
					<div style="font-size: larger; font-weight: bolder; margin-top: 10px;">{{ paperTotalScore }}</div>
				</div>
				</div>

				<div style="margin-top: 10px; margin-left: 4px;">
				<span style="margin-right: 5px; font-size: small; color: #707070;">考试日期：</span>
				<el-date-picker v-model="examDate" type="date" style="width: 150px;" placeholder="选择日期"
					:picker-options="pickerOptions" value-format="YYYY-MM-DD">
				</el-date-picker>
				<span style="margin-left: 15px; margin-right: 5px; font-size: small; color: #707070;">起始时间：</span>
				<el-time-select placeholder="起始时间" start="08:30" step="00:05" end="20:30" v-model="startTime" style="width: 130px;" >
				</el-time-select>
				<span style="margin-left: 15px; margin-right: 5px; font-size: small; color: #707070;">结束时间：</span>
				<el-time-select placeholder="结束时间" start="08:30" step="00:05" end="20:30" v-model="endTime" style="width: 130px;">
				</el-time-select>
				</div>
				  <!-- 题库表格 -->
					<el-dialog title="我的题库" v-model="dialogTableVisible">
						<el-table :data="stockData">
						<el-table-column prop="type" label="题型" align="center" width="100px"></el-table-column>
						<el-table-column prop="stem.itemLabel" label="题干" align="center"></el-table-column>
						<el-table-column prop="knowledgePoint" label="知识点" align="center" width="100px">
						</el-table-column>
						<el-table-column label="操作" align="center" width="80px">
							<template v-slot="{ row }">
							<el-button type="text" size="medium" @click="addFromStock(row)">添加</el-button>
							</template>
						</el-table-column>
						</el-table>
					</el-dialog>

					<transition-group name="myfade" tag="ul" class="majorGroup">
						<div v-for="item in myArray" :key="item.id" class="majorProblem">
						<!-- 单选题 -->
						<div v-if="item.id === subject[0].id">
							<div style="display: flex; align-items: center;">
							<p style="margin: 0; font-size: larger; font-weight: bold;">{{ item.name }}</p>
							<div style="flex-grow: 1;"></div>
							<div>
								<el-button @click="getFromStock('单选题')" size="medium">题库选题</el-button>
								<el-button type="primary" @click="addItem(0)" size="medium">新建题目</el-button>
							</div>
							</div>
							<draggable handle=".mover" v-model="subjectArray[0].itemList" chosen-class="chosen"
								@start="onStart" @end="onEnd" animation="600">
								<template #item="{item}">
								<transition-group>
								<div :class="isEdit !== item.id ? 'item' : 'chosen'"
									v-for="(item, num) in subjectArray[0].itemList" :key="item.id"
									@click="radioEdit(0, item.id)" @blur="cancelEdit">

									<el-tag effect="dark" class="mover" size="medium"> {{ num + 1 }} </el-tag>
									<div class="showRadio" v-if="isEdit !== item.id">
									<el-input v-model='item.subject'></el-input>

									<div class="flex" v-for="o in item.answers" :key="o.no" style="margin-top: 5px;">
										<div class="radio">
										<span :class="{radiosmall: o.no === item.correctAnswer}"></span>
										</div>

										<el-input v-model='o.answer' style="margin-left: 10px;"></el-input>
									</div>
									</div>

									<div class="editRadio" v-if="isEdit === item.id">
									<el-input v-model='item.subject'></el-input>

									<div class="flex" v-for="o in item.answers" :key="o.no" style="margin-top: 5px;">
										<div class="radio">
										<span :class="{radiosmall: o.no === item.correctAnswer}"></span>
										</div>

										<el-input v-model='o.answer' style="margin-left: 10px;"></el-input>
										<i class="el-icon-remove-outline" style="margin-left: 10px; color: #707070;"
										@click="removeRadioAnswer(0, num, o.no)"></i>
										<i class="el-icon-circle-plus-outline" style="margin-left: 10px; color: #707070;"
										@click="addRadioAnswer(0, num, o.no)"></i>
									</div>
									</div>
									<div style="flex-grow: 1;"></div>
									<el-tag effect="dark" size="medium" type="info" style="margin-left: 10px;">
									{{ item.totalScore }}分
									</el-tag>
									<div style="margin-left: 5px;">
									<el-button type="danger" @click="deleteItem(0, num)" size="mini">
										<el-icon><Delete /></el-icon>
									</el-button>
									</div>
								</div>
								</transition-group>
							</template>
							</draggable>
						</div>
						 <!-- 多选题 -->
							<div v-if="item.id === subject[1].id">
								<div style="display: flex; align-items: center;">
								<p style="margin: 0; font-size: larger; font-weight: bold;">{{ item.name }}</p>
								<div style="flex-grow: 1;"></div>
								<div>
									<el-button @click="getFromStock('多选题')" size="medium">题库选题</el-button>
									<el-button type="primary" @click="addItem(1)" size="medium">新建题目</el-button>
								</div>
								</div>
								<draggable handle=".mover" v-model="subjectArray[1].itemList" chosen-class="chosen"
								@start="onStart" @end="onEnd" animation="600">
								<template #item="{item}">
								<transition-group>
									<div :class="isEdit !== item.id ? 'item' : 'chosen'"
									v-for="(item, num) in subjectArray[1].itemList" :key="num"
									@click="radioEdit(1, item.id)" @blur="cancelEdit">

									<el-tag effect="dark" class="mover" size="medium"> {{ num + 1 }} </el-tag>

									<!-- 非修改状态 -->
									<div class="showRadio" v-if="isEdit !== item.id">
										<content-edit v-model='item.subject'></content-edit>

										<div class="flex" v-for="o in item.answers" :key="o.no" style="margin-top: 5px;">
										<div class="radio">
											<span :class="{radiosmall: item.correctAnswer.indexOf(o.no) !== -1}"></span>
										</div>
										<content-edit v-model='o.answer' style="margin-left: 10px;"></content-edit>
										</div>
									</div>
									<!-- 修改状态 -->
									<div class="editRadio" v-if="isEdit === item.id">
										<content-edit v-model='item.subject'></content-edit>

										<div class="flex" v-for="o in item.answers" :key="o.no" style="margin-top: 5px;">
										<div class="radio">
											<span :class="{radiosmall: item.correctAnswer.indexOf(o.no) !== -1}"></span>
										</div>
										<content-edit v-model='o.answer' style="margin-left: 10px;"></content-edit>
										<i class="el-icon-remove-outline" style="margin-left: 10px; color: #707070;"
											@click="removeCheckAnswer(1, num, o.no)"></i>
										<i class="el-icon-circle-plus-outline" style="margin-left: 10px; color: #707070;"
											@click="addRadioAnswer(1, num, o.no)"></i>
										</div>
									</div>

									<div style="flex-grow: 1;"></div>
									<el-tag effect="dark" size="medium" type="info" style="margin-left: 10px;">
										{{ item.totalScore }}分
									</el-tag>
									<div style="margin-left: 5px;">
										<el-button type="danger" @click="deleteItem(1, num)" size="mini"
										icon="el-icon-remove-outline">
										<el-icon><Delete /></el-icon>
									</el-button>
									</div>
									</div>
								</transition-group>
							</template>
								</draggable>
							</div>

							  <!-- 填空题 -->
								<div v-if="item.id === subject[2].id">
									<div style="display: flex; align-items: center;">
									<p style="margin: 0; font-size: larger; font-weight: bold;">{{ item.name }}</p>
									<div style="flex-grow: 1;"></div>
									<div>
										<el-button @click="getFromStock('填空题')" size="medium">题库选题</el-button>
										<el-button type="primary" @click="addItem(2)" size="medium">新建题目</el-button>
									</div>
									</div>

									<draggable handle=".mover" v-model="subjectArray[2].itemList" chosen-class="chosen"
									@start="onStart" @end="onEnd" animation="600">
									<template #item="{item}">
									<transition-group>
										<div :class="isEdit !== item.id ? 'item' : 'chosen'"
										v-for="(item, num) in subjectArray[2].itemList" :key="item.id"
										@click="radioEdit(2, item.id)" @blur="cancelEdit">

										<el-tag effect="dark" class="mover" size="medium">{{ num + 1 }}</el-tag>
										<!-- 非修改状态 -->
										<div class="showRadio" v-if="isEdit !== item.id">
											<content-edit v-model='item.subject'></content-edit>
											<div v-for="(o, index) in item.correctAnswer" :key="index" style="margin-top: 15px;">
											<el-input v-model="item.correctAnswer[index]" placeholder="请输入内容" style="width: 300px;"></el-input>
											</div>
										</div>

										<!-- 修改状态 -->
										<div class="editRadio" v-if="isEdit === item.id">
											<content-edit v-model='item.subject'></content-edit>
											<div v-for="(o, index) in item.correctAnswer" :key="index" style="margin-top: 15px; display: flex; align-items: center;">
											<el-input v-model="item.correctAnswer[index]" placeholder="请输入内容" style="width: 300px;"></el-input>
											<i class="el-icon-circle-plus-outline" style="margin-left: 10px; color: #707070;" @click="addDanxuanAnswer(2, num, index)"></i>
											<i class="el-icon-remove-outline" style="margin-left: 10px; color: #707070;" @click="removeDanxuanAnswer(2, num, index)" v-if="item.maxNo === index + 1"></i>
											</div>
										</div>

										<div style="flex-grow: 1;"></div>
										<el-tag effect="dark" size="medium" type="info" style="margin-left: 10px;">{{ item.totalScore }}分</el-tag>
										<div style="margin-left: 5px;">
											<el-button type="danger" @click="deleteItem(2, num)" size="mini" icon="el-icon-remove-outline"></el-button>
										</div>
										</div>
									</transition-group>
									</template>
									</draggable>
								</div>
							<!-- 简答题 -->
							<div v-if="item.id === subject[3].id">
								<div style="display: flex; align-items: center;">
								<p style="margin: 0; font-size: larger; font-weight: bold;">{{ item.name }}</p>
								<div style="flex-grow: 1;"></div>
								<div>
									<el-button @click="getFromStock('简答题')" size="medium">题库选题</el-button>
									<el-button type="primary" @click="addItem(3)" size="medium">新建题目</el-button>
								</div>
								</div>

								<draggable handle=".mover" v-model="subjectArray[3].itemList" chosen-class="chosen"
								@start="onStart" @end="onEnd" animation="600">
								<template #item="{item}">
								<transition-group>
									<div :class="isEdit !== item.id ? 'item' : 'chosen'"
									v-for="(item, num) in subjectArray[3].itemList" :key="item.id"
									@click="radioEdit(3, item.id)" @blur="cancelEdit">

									<el-tag effect="dark" class="mover" size="medium">{{ num + 1 }}</el-tag>

									<!-- 非修改状态 -->
									<div class="showRadio" v-if="isEdit !== item.id">
										<content-edit v-model='item.subject'></content-edit>
										<content-edit v-model='item.correctAnswer' class="analysis" style="margin-top: 15px; width: 500px;"></content-edit>
									</div>

									<!-- 修改状态 -->
									<div class="editRadio" v-if="isEdit === item.id">
										<content-edit v-model='item.subject'></content-edit>
										<content-edit v-model='item.correctAnswer' class="analysis" style="margin-top: 15px; width: 500px;"></content-edit>
									</div>

									<div style="flex-grow: 1;"></div>
									<el-tag effect="dark" size="medium" type="info" style="margin-left: 10px;">
										{{ item.totalScore }}分
									</el-tag>
									<div style="margin-left: 5px;">
										<el-button type="danger" @click="deleteItem(3, num)" size="mini" icon="el-icon-remove-outline">
											<el-icon><Delete /></el-icon>
										</el-button>
									</div>
									</div>
								</transition-group>
								</template>
								</draggable>
							</div>
						</div>
					</transition-group>
				</el-main>
				<el-aside class="rightaside">
					<div v-if="rightAsideType !== -1" style="padding: 10px;">
					<div style="font-size: large; font-weight: bold; text-align: center; margin-top: 10px;">
						您正在修改：{{ subjectArray[rightAsideType].subjectName }}
					</div>

					<el-divider></el-divider>

					<span>所含知识点：</span>
					<span v-for="(item, i) in subjectArray[rightAsideType].itemList" :key="i">
						<div v-if="item.id === isEdit">
						<el-select v-model="item.knowledgePoint" placeholder="请选择" size="medium" style="width: 80%; margin-top: 10px;">
							<el-option v-for="o in knowledgePointList" :key="o.id" :label="o.name" :value="o.id"></el-option>
						</el-select>
						</div>
					</span>
					<el-divider></el-divider>
										<!-- 单选题 -->
					<div v-if="rightAsideType === 0">
						正确答案：
						<div v-for="(item, i) in subjectArray[0].itemList" :key="i">
						<div v-if="item.id === isEdit">
							<div class="flex" v-for="o in item.answers" :key="o.no"
								@click="radioChosen(item.id, o.no)"
								style="margin-top: 10px; border: solid 1px #eee; padding: 5px; border-radius: 5px;">
							<div class="radio">
								<span :class="{ radiosmall: o.no === item.correctAnswer }"></span>
							</div>
							<el-input style="margin-left: 10px;" v-model="o.answer"></el-input>
							</div>
						</div>
						</div>
					</div>

					<!-- 多选题 -->
					<div v-if="rightAsideType === 1">
						正确答案：
						<div v-for="(item, i) in subjectArray[1].itemList" :key="i">
						<div v-if="item.id === isEdit">
							<div class="flex" v-for="o in item.answers" :key="o.no"
								@click="checkBoxChosen(item.id, o.no)"
								style="margin-top: 10px; border: solid 1px #eee; padding: 5px; border-radius: 5px;">
							<div class="radio">
								<span :class="{ radiosmall: item.correctAnswer.includes(o.no) }"></span>
							</div>
							<el-input style="margin-left: 10px;" v-model="o.answer"></el-input>
							</div>
						</div>
						</div>
					</div>

					<!-- 填空题 -->
					<div v-if="rightAsideType === 2">
						<div v-for="(item, i) in subjectArray[2].itemList" :key="i">
						<div v-if="item.id === isEdit">
							答案数量：
							<el-input-number v-model="item.maxNo" controls-position="right" :min="1" :max="10"
											size="medium" style="width: 40%;" disabled>
							</el-input-number>
						</div>
						</div>
					</div>

					<!-- 简答题 -->
					<div v-if="rightAsideType === 3">
						答案数量：
						<el-input-number v-model="jianda" controls-position="right" :min="1" :max="10" size="medium"
										style="width: 40%;" disabled>
						</el-input-number>
					</div>
					<el-divider></el-divider>
						<div v-for="(item, i) in subjectArray[rightAsideType].itemList" :key="i">
							<div v-if="item.id === isEdit">
							<div>
								此题分数：
								<el-input-number v-model="item.totalScore" controls-position="right" :min="1" :max="100" size="medium" style="width: 40%;" @change="scoreChange"></el-input-number>
							</div>
							<el-divider></el-divider>
							<div>
								答案解析：
								<content-edit v-model='item.answerAnalysis' class="analysis"></content-edit>
							</div>
							</div>
						</div>
						</div>
					</el-aside>
	  </el-container>
	</el-container>
  </template>


<script setup>
import draggable from 'vuedraggable';
import { reactive,ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import axios from 'axios';
const router = useRouter();
const route= useRoute();

const classId = ref(0);
const subjectId = ref(1);
const inputVisible = ref(false);
const inputValue = ref('');
const dialogTableVisible = ref(false);
const stockData = ref([]);
const radioStock = ref([]);
const checkStock = ref([]);
const tiankongStock = ref([]);
const jiandaStock = ref([]);
const paperName = ref('');
const paperDescribe = ref('考试备注');
const examDate = ref('');
const startTime = ref('');
const endTime = ref('');
const startTime1 = ref('');
const endTime1 = ref('');
const pickerOptions = reactive({
  disabledDate(v) {
    return v.getTime() < new Date().getTime() - 86400000;
  }
});
const jianda = ref(1);
const knowledgePointMaxValue = ref(1);
const knowledgePointOptions = ref([{
					value: 0,
					label: '知识点一',
					editVisible: false
				}, {
					value: 1,
					label: '知识点二',
					editVisible: false
				}, ]);
const knowledgePointList = ref([{
					id: 5,
					name: "计算机网络概念",
					subjectId: 3,
					subject: null
				}, ]);
const subject = ref([{
						id: 0,
						checkState: false,
						label: '单选题'
					},
					{
						id: 1,
						checkState: false,
						label: '多选题'
					},
					{
						id: 2,
						checkState: false,
						label: '填空题'
					},
					{
						id: 3,
						checkState: false,
						label: '简答题'
					}]);
const drag = ref(false);
const myArray = ref([]);
const isEdit = ref(-1);
const itemMaxNo = ref(3);
const rightAsideType = ref(-1);
const isactive = ref(0);
const initSubjectArray = ref([//initSubjectArray[0]单选题
					{
						id: -1,
						subject: '单选题，以下选项正确的是(  )',
						totalScore: 5,
						knowledgePoint: 0,
						maxNo: 2,
						answers: [{
								no: 0,
								answer: '选项一'
							},
							{
								no: 1,
								answer: '选项二'
							},
							{
								no: 2,
								answer: '选项三'
							}
						],
						correctAnswer: 0, //正确答案的id
						answerAnalysis: '答案解析.......',
					},
					//initSubjectArray[1]多选题
					{
						id: -1,
						subject: '多选题，以下选项正确的有(  )',
						totalScore: 5,
						knowledgePoint: 0,
						maxNo: 2,
						answers: [{
								no: 0,
								answer: '选项一'
							},
							{
								no: 1,
								answer: '选项二'
							},
							{
								no: 2,
								answer: '选项三'
							}
						],
						correctAnswer: [0, 1],
						answerAnalysis: '答案解析.......',
					},
					//initSubjectArray[2]填空题
					{
						id: -1,
						subject: '填空题，关于这个题目正确的答案是_____',
						totalScore: 5,
						knowledgePoint: 0,
						maxNo: 0,
						answers: [],
						correctAnswer: ["填空答案一"],
						answerAnalysis: '答案解析.......',
					},
					//initSubjectArray[3]简答题
					{
						id: -1,
						subject: '简答题，关于这个题目正确的答案是_____',
						totalScore: 5,
						knowledgePoint: 0,
						maxNo: 0,
						answers: [],
						correctAnswer: "简答答案",
						answerAnalysis: '答案解析.......',
					},]);
const paperTotalScore = ref(0);
const subjectArrMaxId = ref(3);
const subjectArray = ref([//subjectArray[0]单选
					{
						//题目类型 0.单选题 1.多选题 2.判断题 3.填空题 4.简答题
						subjectType: 0,
						subjectName: '单选题',
						//题数
						itemCount: 1,
						itemList: [
							// subjectArray[0].itemnList[0]单选第一题
							{
								id: 0,
								subject: '单选题，以下选项正确的是(  )',
								totalScore: 5,
								knowledgePoint: 0,
								maxNo: 2,
								answers: [{
										no: 0,
										answer: '选项一'
									},
									{
										no: 1,
										answer: '选项二'
									},
									{
										no: 2,
										answer: '选项三'
									}
								],
								correctAnswer: 0, //正确答案的id
								answerAnalysis: '答案解析.......',
							},
						]
					},
					//subjectArray[1]多选
					{
						//题目类型 0.单选题 1.多选题 2.判断题 3.填空题 4.简答题
						subjectType: 1,
						subjectName: '多选题',
						//题数
						itemCount: 1,
						itemList: [
							// subjectArray[1].itemnList[0]多选第一题
							{
								id: 1,
								subject: '多选题，以下选项正确的有(  )',
								totalScore: 5,
								knowledgePoint: 0,
								maxNo: 2,
								answers: [{
										no: 0,
										answer: '选项一'
									},
									{
										no: 1,
										answer: '选项二'
									},
									{
										no: 2,
										answer: '选项三'
									}
								],
								correctAnswer: [0, 1],
								answerAnalysis: '答案解析.......',
							},
						],
					},
					//subjectArray[3]填空
					{
						//题目类型 0.单选题 1.多选题 2.判断题 3.填空题 4.简答题
						subjectType: 2,
						subjectName: '填空题',
						//题数
						itemCount: 1,
						itemList: [
							// subjectArray[2].itemnList[0]填空第一题
							{
								id: 2,
								subject: '填空题，关于这个题目正确的答案是_____',
								totalScore: 5,
								knowledgePoint: 0,
								maxNo: 1,
								answers: [],
								correctAnswer: ["填空答案一"],
								answerAnalysis: '答案解析.......',
							},
						],
					},
					//subjectArray[4]简答
					{
						//题目类型 0.单选题 1.多选题 2.判断题 3.填空题 4.简答题
						subjectType: 3,
						subjectName: '简答题',
						//题数
						itemCount: 1,
						itemList: [
							// subjectArray[3].itemnList[0]简答第一题
							{
								id: 3,
								subject: '简答题，关于这个题目正确的答案是_____',
								totalScore: 5,
								knowledgePoint: 0,
								maxNo: 0,
								answers: [],
								correctAnswer: "简答答案",
								answerAnalysis: '答案解析.......',
							},
						],
					},]);
const questionPaperDTO = reactive({
  subjectDTOList: [], // 大题类型
  exam: {
    endTime: "2022-07-14 22:00:00",
    lessonId: 3,
    name: "",
    startTime: "2022-07-14 21:00:00"
  },
  questionListDTOList: []
});


// 初始化界面
const showpage = () => {
  classId.value = route.query.classId;
  subjectId.value = route.query.subjectId;

  axios({
    method: 'get',
    url: `/question/getKnowledgePointListBySubjectId?subjectId=${subjectId.value}`
  }).then(res => {
    knowledgePointList.value = res.data.result;

	for (let i = 0; i < subjectArray.value.length; i++) {
		for (let o = 0; o < subjectArray.value[i].itemList.length; o++) {
			subjectArray.value[i].itemList[o].knowledgePoint = knowledgePointList.value[0].id
		}
		initSubjectArray.value[i].knowledgePoint = knowledgePointList.value[0].id
	}
  }).catch(err => {
    console.log(err);
  });
};

showpage()

// 返回主界面
const backToMain = async () => {
  try {
    await ElMessageBox.confirm('确认退出?试卷将无法保存', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    router.push('/teachermain');
    ElMessage({
      type: 'success',
      message: '返回成功!'
    });
  } catch (error) {
    ElMessage({
      type: 'info',
      message: '已取消退出'
    });
  }
};

// 开始拖拽事件
const onStart = () => {
  drag.value = true;
};

// 拖拽结束事件
const onEnd = () => {
  drag.value = false;
};

// 选择加入题目
const handleCheckChange = (checked, this_subject) => {
  if (checked) {
    let newList = {
      id: this_subject.id,
      name: this_subject.label,
    };
    myArray.value.push(newList);
	console.log("handleCheckChange-------------")
	console.log(myArray.value)
  } else { // 选择删除题目
    for (let i = 0; i < myArray.value.length; i++) {
      if (myArray.value[i].id === this_subject.id) {
        myArray.value.splice(i, 1);
      }
    }
  }
  scoreChange() // 调用更新分数的方法
};

// 题库获取方法
const getFromStock = async (DatiName) => {
  try {
    const res = await axios.get(`/question/getByExamPaper?subjectId=${subjectId.value}&type=${DatiName.value}`);
    res.data.result.forEach(item => {
      const obj = JSON.parse(item.stem);
      const object = {
        id: item.id,
        type: item.type,
        knowledgePointId: item.knowledgePointId,
        knowledgePoint: item.knowledgePoint.name,
        stem: obj,
        answer: item.answer,
      };
      stockData.push(object);
    });
    dialogTableVisible.value = true;
  } catch (err) {
    console.log(err);
  }
};

const addFromStock = (row) => {
  const newItem = JSON.parse(JSON.stringify(row));
  newItem.id = subjectArrMaxId + 1;
  subjectArrMaxId.value += 1;
  newItem.totalScore = 5;
  newItem.subject = row.stem.itemLabel;
  newItem.answers = row.stem.answerArray;
  delete newItem.stem;
  newItem.knowledgePoint = newItem.knowledgePointId;
  delete newItem.knowledgePointId;

  switch (row.type) {
    case "单选题":
      newItem.correctAnswer = Number(newItem.answer);
      newItem.maxNo = newItem.answers.length - 1;
      delete newItem.type;
      delete newItem.answer;
      subjectArray.value[0].itemCount++;
      subjectArray.value[0].itemList.push(newItem);
      break;
    case "多选题":
      const multiAnswers = newItem.answer.split(",");
      newItem.correctAnswer = multiAnswers;
      newItem.maxNo = newItem.answers.length - 1;
      delete newItem.type;
      delete newItem.answer;
      subjectArray.value[1].itemCount++;
      subjectArray.value[1].itemList.push(newItem);
      break;
	case "填空题":
      const fillInAnswers = newItem.answer.split(",");
      newItem.correctAnswer = fillInAnswers;
      newItem.maxNo = 1;
      delete newItem.type;
      delete newItem.answer;
      subjectArray.value[2].itemCount++;
      subjectArray.value[2].itemList.push(newItem);
      break;
    case "简答题":
      newItem.correctAnswer = newItem.answer;
      newItem.maxNo = 1;
      delete newItem.type;
      delete newItem.answer;
      subjectArray.value[3].itemCount++;
      subjectArray.value[3].itemList.push(newItem);
      break;
  }
};

// 添加小题
const addItem = (subject) => {
  console.log("addItem------------------")
  console.log(myArray.value)
  const newItem = JSON.parse(JSON.stringify(initSubjectArray.value[subject]));
  newItem.id = subjectArrMaxId.value + 1;
  subjectArrMaxId.value += 1;
  subjectArray.value[subject].itemCount++;
  subjectArray.value[subject].itemList.push(newItem);
  scoreChange();
};

// 删除小题
const deleteItem = async (subject, num) => {
  if (subjectArray.value[subject].itemList.length > 1) {
    try {
      await ElMessageBox.confirm('此操作将永久删除该题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      rightAsideType.value = -1;
      isEdit.value = -1;
      subjectArray.value[subject].itemList.splice(num, 1);
      scoreChange();
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
    } catch (error) {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      });
    }
  } else {
    ElMessage({
      type: 'warning',
      message: '已是最后一小题，无法删除哦，可以尝试删除整道大题'
    });
  }
};

// 总分变化
const scoreChange = () => {
  let newScore = 0;
  for (let i = 0; i < subjectArray.value.length; i++) {
    if (subject.value[i].checkState) {
      for (let o = 0; o < subjectArray.value[i].itemList.length; o++) {
        newScore += subjectArray.value[i].itemList[o].totalScore;
      }
    }
  }
  paperTotalScore.value = newScore;
};

// 取消编辑
const cancelEdit = () => {
  isEdit.value = -1;
};

// 修改小题
const radioEdit = (subjectNo, id) => {
  subjectArray.value[subjectNo].itemList.forEach(item => {
    if (item.id === id) {
      rightAsideType.value = subjectNo;
      isEdit.value = id;
    }
  });
};

// 单选选中
const radioChosen = (id, no) => {
  subjectArray.value[0].itemList.forEach(item => {
    if (item.id === id) {
      item.correctAnswer = no;
    }
  });
};

// 多选选中
const checkBoxChosen = (id, no) => {
  subjectArray.value[1].itemList.forEach(item => {
    if (item.id === id) {
      const index = item.correctAnswer.indexOf(no);
      if (index !== -1) {
        if (item.correctAnswer.length > 2) {
          item.correctAnswer.splice(index, 1);
        }
      } else {
        item.correctAnswer.push(no);
      }
    }
  });
};

// 删除单选选项
const removeRadioAnswer = (subject, num, no) => {
  const item = subjectArray.value[subject].itemList[num];
  if (item.answers.length > 1) {
    const index = item.answers.findIndex(a => a.no === no);
    if (index !== -1) {
      item.answers.splice(index, 1);
      item.correctAnswer = item.answers[0].no;
    }
  }
};

// 删除多选选项
const removeCheckAnswer = (subject, num, no) => {
  const item = subjectArray.value[subject].itemList[num];
  if (item.answers.length > 2) {
    const answerIndex = item.answers.findIndex(a => a.no === no);
    if (answerIndex !== -1) {
      item.answers.splice(answerIndex, 1);
      const correctIndex = item.correctAnswer.indexOf(no);
      if (correctIndex !== -1) {
        item.correctAnswer.splice(0, item.correctAnswer.length);
        item.correctAnswer.push(item.answers[0].no, item.answers[1].no);
      }
    }
  }
};

const removeDanxuanAnswer = (subject, num, index) => {
  if (index >= 1) {
    subjectArray.value[subject].itemList[num].correctAnswer.splice(-1);
    subjectArray.value[subject].itemList[num].maxNo--;
  }
};

const addRadioAnswer = (subject, num, no) => {
  subjectArray.value[subject].itemList[num].answers.forEach(answer => {
    if (answer.no === no) {
      const newAnswer = {
        no: subjectArray.value[subject].itemList[num].maxNo + 1,
        answer: answer.answer,
      };
      subjectArray.value[subject].itemList[num].maxNo++;
      subjectArray.value[subject].itemList[num].answers.push(newAnswer);
    }
  });
};

const addDanxuanAnswer = (subject, num, index) => {
  const newAnswer = JSON.parse(JSON.stringify(subjectArray.value[subject].itemList[num].correctAnswer[index]));
  subjectArray.value[subject].itemList[num].correctAnswer.push(newAnswer);
  subjectArray.value[subject].itemList[num].maxNo++;
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    // 假设有一个对应的ref
    this.$refs.saveTagInput.$refs.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    const newPoint = {
      value: knowledgePointMaxValue + 1,
      label: inputValue.value,
      editVisible: false
    };
    knowledgePointMaxValue.value++;
    knowledgePointOptions.push(newPoint);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const handleEditConfirm = (num) => {
  knowledgePointOptions[num].editVisible = false;
  inputVisible.value = false;
};

const handleDeleteTag = (num, value) => {
  let pointUsed = false;
  subjectArray.value.forEach((subjectItem, i) => {
    if (subject[i].checkState) {
      subjectItem.itemList.forEach((item) => {
        if (item.knowledgePoint === value) {
          pointUsed = true;
        }
      });
    }
  });

  if (!pointUsed) {
    knowledgePointOptions.splice(num, 1);
  } else {
    ElMessage({
      message: '已被使用哦，无法删除',
      type: 'warning'
    });
  }
};

const initQuestionPaperDTO = () => {
  questionPaperDTO.exam.lessonId = Number(classId.value);
  questionPaperDTO.exam.name = paperName.value;
  questionPaperDTO.exam.startTime = examDate.value.concat(' ', startTime.value, ':00');
  questionPaperDTO.exam.endTime = examDate.value.concat(' ', endTime.value, ':00');
  questionPaperDTO.questionListDTOList = [];
  questionPaperDTO.subjectDTOList = [];

  myArray.value.forEach((myItem) => {
    const newMyArray = {
      id: myItem.id,
      label: myItem.name
    };
    questionPaperDTO.subjectDTOList.push(newMyArray);
  });

  subjectArray.value.forEach((subjectItem, i) => {
    const newSubject = JSON.parse(JSON.stringify(subjectItem));
    questionPaperDTO.questionListDTOList.push(newSubject);
    questionPaperDTO.questionListDTOList[i].itemList = [];

    subjectItem.itemList.forEach((item) => {
      const newItem = JSON.parse(JSON.stringify(item));
      newItem.correctAnswer = newItem.correctAnswer.toString();
      delete newItem.maxNo;
      delete newItem.answerAnalysis;
      const newStem = {
        itemLabel: newItem.subject,
        answerArray: newItem.answers
      };
      newItem.stem = newStem;
      newItem.knowledgePointId = newItem.knowledgePoint;
      delete newItem.answers;
      delete newItem.subject;
      delete newItem.knowledgePoint;
      questionPaperDTO.questionListDTOList[i].itemList.push(newItem);
    });
  });
};



// 提交考试
const submitExam = () => {
  initQuestionPaperDTO(); 

  if (myArray.value.length === 0) {
    ElMessage.error('还未选择题目哦');
  } else if (paperName.value === '') {
    ElMessage.error('还未填写考试名称哦');
  } else if (examDate.value === '' || startTime.value === '' || endTime.value === '') {
    ElMessage.error('还未选择考试时间哦');
  } else {
    axios({
      method: 'post',
      url: '/examPaper/addPaperManual',
      data: questionPaperDTO,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      ElMessage({
        message: '恭喜你，创建成功',
        type: 'success'
      });
      router.push('/teachermain');
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    });
  }
};
</script>
<style scoped>
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

	.home-container {
		height: 100%;
		background-color: #F5F5F5;
	}

	.header {
		height: 7vh !important;
	}

	.leftaside {
		padding: 20px;
		background-color: white;
		width: 300px !important;
		height: 91vh;
		margin-left: 1%;
		margin-right: 1%;
		/* margin-bottom: 1%; */
		border-radius: 5px;
	}

	.button-new-tag {
		margin-top: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px;
		margin-top: 10px;
		vertical-align: bottom;
	}

	.el-main {
		width: 10%;
		background-color: white;
		border-radius: 5px;
		/* margin-bottom: 1%; */
		height: 91vh;
	}


	.majorProblem {
		border: #DCDFE6;
		border-color: #DCDFE6;
		border-style: solid;
		border-radius: 5px;
		border-width: 1px;
		padding: 5px;
		margin-bottom: 20px;
	}

	.contenteditable {
		border: 1px solid white;
		box-sizing: border-box;
	}

	.contenteditable:focus {
		outline: none;
		/* border: solid 2px #3089dc; */
		border: 1px solid #3089dc;
	}

	input[type=titleText] {
		height: 50px;
		width: 100%;
		font-size: 20px;
		/* padding: 12px 20px; */
		/* margin: 8px 0; */
		display: inline-block;
		border: 1px solid white;
		/* border: none; */
		box-sizing: border-box;
	}

	input[type=titleText]:focus {
		outline: none;
		/* border: solid 2px #3089dc; */
		border: 1px solid #3089dc;
	}

	textarea {
		width: 100%;
		height: 50px;
		/* padding: 12px 20px; */
		box-sizing: border-box;
		/* border: none; */
		border: 2px solid #ccc;
		border-radius: 4px;
		/* background-color: #f8f8f8; */
		resize: none;
	}

	textarea:focus {
		outline: none;
	}

	.rightaside {
		background-color: white;
		width: 300px !important;
		margin-left: 1%;
		margin-right: 1%;
		/* margin-bottom: 1%; */
		height: 91vh;
		border-radius: 5px;
	}

	.analysis {
		padding: 10px;
		height: auto !important;
		min-height: 80px;
		border: 1px solid #DCDFE6;
		border-radius: 5px;
		margin-top: 10px;
	}

	.analysis:focus {
		outline: none;
		border: 1px solid #3089dc;
	}

	.majorGroup {
		padding: 0;
	}

	/*小题样式*/
	.item {
		padding: 6px;
		border: solid 1px #F9F9F9;
		background-color: #F9F9F9;
		margin-top: 10px;
		display: flex;
		border-radius: 5px;
		margin-bottom: 0;
	}

	.subArray {
		padding: 10px;
		border: solid 1px #F5F5F5;
		background-color: #F5F5F5;
		margin-top: 10px;
		/* display: flex; */
		border-radius: 5px;
		margin-bottom: 0;
	}

	.answer-radio {
		margin-top: 10px;
		display: flex;
	}

	/*选中样式*/
	.chosen {
		padding: 6px;
		border: solid 1px #3089dc;
		background-color: #F9F9F9;
		margin-top: 10px;
		display: flex;
		border-radius: 5px;
	}

	.subArrayChosen {
		padding: 10px;
		border: solid 1px #3089dc;
		background-color: #F5F5F5;
		margin-top: 10px;
		/* display: flex; */
		border-radius: 5px;
		margin-bottom: 0;
	}

	.mover {
		/* background-color: #3089DC; */
		margin-right: 10px;
		/* margin-left: auto; */
		/* float: right; */
		cursor: move;
	}

	/* 效果过程 */
	.myfade-enter-active,
	.myfade-leave-active {
		/* opacity 透明度 */
		transition: opacity 0.8s
	}

	/* 进场的瞬间与离场的效果添加 */
	.myfade-enter,
	.myfade-leave-to {
		opacity: 0
	}


	/* 变换顺序效果 */
	.myfade-move {
		transition: transform 0.5s;
	}
</style>

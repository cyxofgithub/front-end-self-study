<template>
	<el-container class="home-container">
		<el-header class="header">
			<el-button size="lager" type="success" @click="preserve">暂存</el-button>
			<div style="flex-grow: 1;"></div>
			<div class="header-center" style="font-size: 30px;font-weight: bold;">
				{{ paperName }}
			</div>
			<div style="flex-grow: 1;"></div>
			<el-button size="lager" type="success" @click="handIn">交卷</el-button>
		</el-header>
		<el-container>
			<el-aside class="leftaside">
				<div style="text-align: center;margin-top: 10px; margin-bottom: 30px;">
					<div>
						剩余时间
					</div>
					<div class="demo-progress" style="margin-top: 20px;margin-bottom: 10px;">
						<el-progress type="circle" :percentage="percent / 10" />
					</div>
					<div>
						{{ m }}分
						{{ s }}秒
					</div>
				</div>
				<el-divider>
					<h3>答题卡</h3>
				</el-divider>
				<div class="questionCard">
					<div v-for="(item, index) in questionTypeList" :key="index" style="display: left;width: 100%;">
						<div style="width: 100%;margin-top: 10px;margin-bottom: 5px;">
							{{ item.typeName }}
						</div>
						<div style="display: flex;flex-direction: row;width: 100%;">
							<el-button v-for="(data, k) of item.questionList" :key="k" :type="data.buttonType"
								@click='toShowQuestion(data.no)' size="medium">
								{{ data.number }}
							</el-button>
						</div>
					</div>


				</div>
			</el-aside>
			<el-main>
				<div class="subject" v-for="(item, index) in questionTypeList" :key="index">
					<div v-for="(data, k) in item.questionList" :key="k">
						<div v-if="data.no === questionShow">
							<div style="display: flex;align-items: baseline;">
								<div style="font-size: 30px;font-weight: bolder; margin-bottom: 20px;">
									{{ item.typeName }}
								</div>
								<div style="flex-grow: 20;"></div>
								<div
									style="flex-grow: 1 ; background-color: #67C23A; border-radius: 5px;color: white;text-align: center; padding: 10px;">
									<div style="font-size: larger;font-weight: bolder;">
										{{ data.totalScore }}分
									</div>
								</div>
							</div>

							<div slot="header" class="clearfix" style="margin-top: 10px;margin-bottom: 30px;">
								<el-tag effect="dark" size="medium"> {{ data.number }} </el-tag>
								<span style="font-weight: bold; font-size:18px; margin-left: 5px;">{{ data.subject
								}}</span>
							</div>

							<el-radio-group v-if="item.type === 1" v-model="data.examineAnswer" type='vertical'>
								<div v-for="o in data.answers" :key="o.no" style="float: left;width: 100%;">
									<el-radio :label="o.no" class="answer-radio" style="margin-bottom: 15px;">
										{{ o.answer }}
									</el-radio>
								</div>
							</el-radio-group>

							<el-checkbox-group v-if="item.type === 2" v-model="data.examineAnswer" type='vertical'>
								<div v-for="(o, index) in data.answers" :key="index" style="float: left;width: 100%;">
									<el-checkbox :label="o.no" class="answer-checkbox" style="margin-bottom: 15px;">
										{{ o.answer }}
									</el-checkbox>
								</div>
							</el-checkbox-group>

							<el-radio-group v-if="item.type === 3" v-model="data.examineAnswer">
								<div style="width: 100%;margin-bottom: 15px;">
									<el-radio label="对" class="answer-radio">对</el-radio>
								</div>
								<div style="width: 100%;">
									<el-radio label="错" class="answer-radio">错</el-radio>
								</div>
							</el-radio-group>

							<div v-if="item.type === 4">
								<div v-for="(i, no) in data.examineAnswer" :key="no" style="margin-bottom: 15px;">
									<el-input type="textarea" :rows="2" v-model="data.examineAnswer[no]" resize="none"
										maxlength="150">
									</el-input>
								</div>
							</div>

							<el-input v-if="item.type === 5" type="textarea" :rows="10" v-model="data.examineAnswer[0]"
								resize="none" maxlength="2000">
							</el-input>

						</div>
					</div>
				</div>

			</el-main>
			<el-aside class="rightaside">
				<div style="text-align: center;">
					<p style="font-size: larger;font-weight: bold;">考生信息</p>
				</div>
				<div style="text-align: center;margin-top: 20px;">
					<el-image style="width: 100px; height: 140px" :src="imageUrl" fit="cover">
						
					</el-image>
				</div>
				<div style="margin-top: 20px;"> 姓名：{{ stuName }}</div>
				<div style="margin-top: 10px;"> 学号：{{ stuId }}</div>
				<div style="margin-top: 10px;"> 班级信息：{{ className }}</div>
				<div style="font-size: small;margin-top: 10px;"> 考试时间：{{ timeRange }}</div>

				<el-divider />
				<div style="text-align: center;">
					<h3>监考画面</h3>
				</div>
				<!-- <div class="box" style="text-align: center;"> -->
				<div class="camera_outer" style="text-align: center;">
					<video id="videoCamera" style="width:78%" autoplay ref="videos"></video>
					<canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
					<!-- <button @click="setImage">发送</button> -->
				</div>
				<!-- </div> -->
			</el-aside>
		</el-container>
	</el-container>
</template>
<script setup>
import { ref, reactive, onMounted,watch ,onBeforeUnmount} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

import axios from 'axios';
const router = useRouter()
const videoWidth = ref(100);
const videoHeight = ref(100);
const imgSrc = ref('');
const thisCanvas = ref(null);
const thisContext = ref(null);
const thisVideo = ref(null);
const disappear = ref(0);

const stuName = ref("");
const stuId = ref("001");
const imageUrl = ref("zjz.jpg");
const paperName = ref("");
const examId = ref(0);
const className = ref("");
const stuInfoGet = reactive({});

const startTime = ref("2022-07-05 14:50:00");
const endTime = ref("2024-07-05 15:00:00");
const totalTime = ref(43200000); // 20分钟 20*60*1000
const percent = ref(999);
const m = ref(0);
const s = ref(0);
const timeRange = ref("2022-07-10 18:00-20:00");

// 焦点监控
const leftTimes = ref(3);
const leftImagesTimes = ref(3);
const isShow = ref(false);
const isImageWarnShow = ref(false);

const questionShow = ref(0);

const pageInfoGet = reactive({});
const questionListGet = ref([]);
const examingDTOList = ref([]);

const questionTypeList = ref([]);

// WebRTC配置
const localstream = ref(null);
const signalClient = ref(null);
const roomId = ref('');
const videoList = ref([]);
const socket = ref(null);
const studentNames = ref([]);
const studentName = ref('lily'); // axios
const socketURL = ref('https://locahost:3000'); // 内网地址
const peerOptions = reactive({});
const ioOptions = reactive({ rejectUnauthorized: false, transports: ['polling', 'websocket'] });

watch(pageInfoGet, (newValue, oldValue) => {
    initInfo();
});

watch(questionListGet, (newValue, oldValue) => {
    initPaper();
});

watch(questionTypeList, (newValue, oldValue) => {
    showQuestionCard();
});

watch(stuInfoGet, (newValue, oldValue) => {
    initStu();
});

watch(disappear, (newValue, oldValue) => {
    showImageWarn();
});

onMounted(() => {
    showpage();
    showQuestionCard();
    getCompetence();
    const handleFocus = () => {
    if (document.visibilityState === "visible" && !isShow.value && leftTimes.value > 0) {
      isShow.value = true;
      leftTimes.value -= 1;
      showWarn();
    } else if (document.visibilityState === "visible" && !isShow.value && leftTimes.value <= 0) {
      isShow.value = true;
      $notify({
        title: '警告',
        message: '由于您切换界面次数过多，已强制交卷',
        type: 'warning'
      });
      confirmHandIn();
    }
  };

  const handleResize = () => {
    if (document.visibilityState === "visible" && !isShow.value && leftTimes.value > 0) {
      isShow.value = true;
      leftTimes.value -= 1;
      showWarn();
    } else if (document.visibilityState === "visible" && !isShow.value && leftTimes.value <= 0) {
      isShow.value = true;
      $notify({
        title: '警告',
        message: '由于您切换界面次数过多，已强制交卷',
        type: 'warning'
      });
      confirmHandIn();
    }
  };

  window.addEventListener("focus", handleFocus);
  window.addEventListener("resize", handleResize);
});

const getCompetence = async () => {
    thisCanvas.value = document.getElementById('canvasCamera');
    thisContext.value = thisCanvas.value.getContext('2d');
    thisVideo.value = document.getElementById('videoCamera');

    if (!navigator.mediaDevices) {
        navigator.mediaDevices = {};
    }

    if (!navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = (constraints) => {
            const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;

            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            return new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        };
    }

    const constraints = {
        audio: false,
        video: {
            width: videoWidth.value,
            height: videoHeight.value,
            transform: 'scaleX(-1)'
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if ('srcObject' in thisVideo.value) {
            thisVideo.value.srcObject = stream;
            // WebRTC
            localStream.value = stream;
            join(); 
        } else {
            thisVideo.value.src = window.URL.createObjectURL(stream);
        }
        thisVideo.value.onloadedmetadata = (e) => {
            thisVideo.value.play();
        };
    } catch (err) {
        console.error(err);
    }
};

const setImage = async (stuName) => {
    thisContext.value.drawImage(thisVideo.value, 0, 0, videoWidth.value, videoHeight.value);
    const image = thisCanvas.value.toDataURL('image/png');
    imgSrc.value = dataURLtoFile(image, 'test.png');
    console.log(disappear.value);
};

const showImageWarn = () => {
    if (disappear.value >= 10 && !isImageWarnShow.value) {
        if (leftImagesTimes.value > 0) {
            leftImagesTimes.value--;
            isImageWarnShow.value = true;
            ElConfirm('请规范考试行为，进入摄像区域，严禁替考，违规3次将自动交卷，当前剩余' + leftImagesTimes.value + '次', '警告', {
                confirmButtonText: '我知道了',
                cancelButtonText: '交卷',
                type: 'warning'
            }).then(() => {
                isImageWarnShow.value = false;
            }).catch(() => {
                isImageWarnShow.value = false;
                handIn();
            });
        } else {
            isImageWarnShow.value = true;
            ElNotify({
                title: '警告',
                message: '由于您本人离开考试区域过多，已强制交卷',
                type: 'warning'
            });
            confirmHandIn(); 
        }
    }
};

const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const stopNavigator = () => {
    if (thisVideo.value && thisVideo.value.srcObject) {
        thisVideo.value.srcObject.getTracks().forEach(track => track.stop());
    }
};

const showpage = () => {
    examId.value = router.currentRoute.value.query.examId;
    getPage();
    getExamInfo();
    getStudent();
};

const getStudent = async () => {
    try {
        const res = await axios.get('/student/getStudentInfo');
        stuInfoGet.value = res.data.result;
    } catch (err) {
        console.error(err);
    }
};

const initStu = () => {
    stuName.value = stuInfoGet.value.name;
    stuId.value = stuInfoGet.value.id;
    imageUrl.value = stuInfoGet.value.imageUrl;
};

const getExamInfo = async () => {
    try {
        const res = await axios.get('/exam/getById/' + examId.value);
        pageInfoGet.value = res.data.result;
    } catch (err) {
        console.error(err);
    }
};

const getPage = async () => {
    try {
        const res = await axios.get('/examing/getExamInfo?examId=' + examId.value);
        questionListGet.value = res.data.result;
    } catch (err) {
        console.error(err);
    }
};

const initInfo = () => {
    paperName.value = pageInfoGet.value.name;
    startTime.value = pageInfoGet.value.startTime;
    endTime.value = pageInfoGet.value.endTime;
    className.value = pageInfoGet.value.lesson.name;
    timeRange.value = startTime.value.slice(0, 16).concat("-", endTime.value.slice(11, 16));
    countTime();
};

const initPaper = () => {
    questionListGet.value.forEach(question => {
        switch (question.typeName) {
            case "单选题":
                question.type = 1;
                break;
            case "多选题":
                question.type = 2;
                break;
            case "填空题":
                question.type = 4;
                break;
            case "简答题":
                question.type = 5;
                break;
            // 其他类型的处理
        }

        question.questionList.forEach((q, index) => {
            const obj = JSON.parse(q.stem);
            q.subject = obj.itemLabel;
            q.answers = obj.answerArray;
            q.buttonType = '';
            q.number = index + 1;

            switch (question.typeName) {
                case "单选题":
                    q.examineAnswer = [''];
                    break;
                case "多选题":
                    q.examineAnswer = [];
                    break;
                case "填空题":
                    q.examineAnswer = q.examineAnswer.split(',');
                    break;
                case "简答题":
                    q.examineAnswer = [''];
                    break;
                // 其他类型的处理
            }
        });
    });
    questionTypeList.value = questionListGet.value;
    if (questionTypeList.value.length > 0 && questionTypeList.value[0].questionList.length > 0) {
        questionShow.value = questionTypeList.value[0].questionList[0].no;
    }
};

const countTime = () => {
    const startDate = new Date(startTime.value);
    const start = startDate.getTime();
    const date = new Date();
    const now = date.getTime();
    const endDate = new Date(endTime.value);
    const end = endDate.getTime();
    const leftTime = end - now;
    totalTime.value = end - start;

    if (leftTime >= 0) {
        m.value = Math.floor(leftTime / 1000 / 60);
        s.value = Math.floor(leftTime / 1000 % 60);
        percent.value = Math.floor(leftTime * 1000 / totalTime.value);
    } else if (now >= end) {
        endExam();
        return;
    }

    setImage(stuName.value);
    setTimeout(countTime, 1000);
};

const toShowQuestion = (nowNumber) => {
    questionShow.value = nowNumber;
    showQuestionCard();
};

const showQuestionCard = () => {
    questionTypeList.value.forEach(questionType => {
        questionType.questionList.forEach(question => {
            let isDone = question.examineAnswer.length > 0 && 
                         question.examineAnswer.every(answer => answer !== '');
            question.buttonType = isDone ? 'success' : '';
            if (questionShow.value === question.no) {
                question.buttonType = 'primary';
            }
        });
    });
};

const preserve = () => {
    questionTypeList.value.forEach(questionType => {
        let newSubject = JSON.parse(JSON.stringify(questionType));
        let newQuestions = newSubject.questionList.map(question => {
            let newStem = {
                itemLabel: question.subject,
                answerArray: question.answers
            };
            return {
                ...question,
                examineAnswer: question.examineAnswer.toString(),
                stem: JSON.stringify(newStem),
                answers: undefined,
                subject: undefined,
                buttonType: undefined
            };
        });

        examingDTOList.value.push({
            ...newSubject,
            questionList: newQuestions
        });
    });

    axios.post('/examing/postExamInfo', examingDTOList.value, {
        params: { examId: examId.value },
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        ElMessage({ message: '保存成功', type: 'success' });
    }).catch(err => {
        console.error(err);
    });
};
const confirmHandIn = async () => {
    await preserve();
    try {
        const res = await axios.get('/examing/finishAnswerSheet?examId=' + examId.value);
        ElMessage({ type: 'success', message: '提交成功!' });
        router.push('/studentmain');
    } catch (err) {
        ElMessage.error("提交失败");
    }
};
const handIn = () => {
    ElMessageBox.confirm('此操作将提交试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        confirmHandIn();
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消提交' });
    });
};

const endExam = async () => {
    try {
        const res = await axios.get('/examing/finishExam/' + examId.value);
        ElMessageBox.alert('考试已结束，答题卡将自动提交!', '提示', {
            confirmButtonText: '确定'
        }).then(() => {
            router.push('/studentmain');
        });
    } catch (err) {
        ElMessage.error("提交失败");
    }
};
const showWarn = () => {
    ElMessageBox.confirm(
        `请勿离开答题界面！离开3次将自动交卷，当前剩余${leftTimes.value}次`, 
        '警告', {
            confirmButtonText: '我知道了',
            cancelButtonText: '交卷',
            type: 'warning'
        }
    ).then(() => {
        isShow.value = false;
    }).catch(() => {
        isShow.value = false;
        handIn();  
    });
};
const join = async () => {
  console.log('join');
  socket.value = io(socketURL.value);
  signalClient.value = new SimpleSignalClient(socket.value);

  signalClient.value.once('discover', (discoveryData) => {
    discoveryData.peers.forEach(peerID => {
      if (peerID !== socket.value.id) {
        connectToPeer(peerID);
      }
    });
    discoveryData.eMembers.forEach(member => studentNames.value.push(member.name));
  });

  signalClient.value.on('request', async (request) => {
    const { peer } = await request.accept();
    videoList.value.forEach(v => {
      if (v.isLocal) {
        onPeer(peer, v.stream);
      }
    });
  });

  try {
    const res = await axios.get("/student/getStudentInfo");
    let memberRoom = {
      roomId: examId.value,
      member: {
        streamId: localStream.value.id,
        id: socket.value.id,
        name: res.data.result.name
      }
    };
    signalClient.value.discover(memberRoom);
  } catch (err) {
    console.error(err);
  }
};

const connectToPeer = async (peerID) => {
  try {
    const { peer } = await signalClient.value.connect(peerID, String(examId.value));
    videoList.value.forEach(v => {
      if (v.isLocal) {
        onPeer(peer, v.stream);
      }
    });
  } catch (e) {
    console.error('Error connecting to peer', e);
  }
};
const onPeer = (peer, localStream) => {
  console.log('onPeer');
  console.log(localStream);
  peer.addStream(localStream);
  peer.on('stream', (remoteStream) => {
    console.log(remoteStream);
    joinedRoom(remoteStream, false);
    peer.on('close', () => {
      videoList.value = videoList.value.filter(item => item.id !== remoteStream.id);
    });
    peer.on('error', (err) => {
      console.error('peer error', err);
    });
  });
};

const joinedRoom = (stream, isLocal) => {
  if (!videoList.value.some(video => video.id === stream.id)) {
    let video = {
      id: stream.id,
      muted: isLocal,
      stream: stream,
      isLocal: isLocal
    };
    videoList.value.push(video);
  }
};

const leave = () => {
  videoList.value.forEach(v => v.stream.getTracks().forEach(t => t.stop()));
  videoList.value = [];
  if (signalClient.value) {
    signalClient.value.peers().forEach(peer => peer.removeAllListeners());
    signalClient.value.destroy();
    signalClient.value = null;
  }
  if (socket.value) {
    socket.value.destroy();
    socket.value = null;
  }
};

onBeforeUnmount(() => {
  stopNavigator();
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
    border-radius: 5px;
}

.demo-progress .el-progress--line {
    width: 350px;
}



.el-main {
    background-color: white;
    border-radius: 5px;
    height: 91vh;
}

.el-radio .el-radio__label {
    font-size: 16px !important;
}

.el-checkbox .el-checkbox__label {
    font-size: 16px !important;
}

.rightaside {
    padding: 15px;
    background-color: white;
    width: 300px !important;
    margin-left: 1%;
    margin-right: 1%;
    height: 91vh;
    border-radius: 5px;
}

.camera_outer {
    position: relative;
    overflow: hidden;
    background-size: 100%;
}

.camera_outer video,
.camera_outer canvas,
.camera_outer .tx_img {
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
}

.camera_outer .btn_camera {
    position: absolute;
    bottom: 4px;
    left: 0;
    right: 0;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.3);
    line-height: 50px;
    text-align: center;
    color: #ffffff;
}

.camera_outer .bg_r_img {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
}

.camera_outer .img_bg_camera {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
}

.camera_outer .img_bg_camera img {
    width: 100%;
    height: 100%;
}

.camera_outer .img_bg_camera .img_btn_camera {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
    color: #ffffff;
}

.camera_outer .img_bg_camera .img_btn_camera .loding_img {
    width: 50px;
    height: 50px;
}

</style>
<template>
	<div class="main">
		<div>
		</div>
		<div class="body">
			<div class="center">
				<el-header class="header">
					<p class="theLogo">慧测</p>
				</el-header>
				<el-main style="width:100%;">
					<el-steps :space="200" :active="active" align-center class="theSteps">
						<el-step title=""></el-step>
						<el-step title=""></el-step>
						<el-step title=""></el-step>
					</el-steps>
					<div class="mainDiv">
						<el-carousel arrow="never" :autoplay="false" indicator-position="none" style="height:50vh"
							ref="carousel" :loop="false">
							<el-carousel-item class="carouselItem">
								<div style="font-size: 30px;margin-bottom: 5vh;font-weight: bold;">选择你要注册的身份</div>
								<div class="characteristic">
									<div class="selectBtn" :class="{ selected: selectChara == 'student' }"
										@click="selectBtnClick('student')">
										<i class=""></i>
										<p style="font-size: 22px;margin-bottom: 1vh;font-weight: bold;">学生用户</p>
										<span style="font-size:13px">
											身为学生，您可以在慧测参加班级考试，并看到系统对您从成绩的评估
										</span>
									</div>
									<div class="selectBtn" style="margin-left:1vw"
										:class="{ selected: selectChara == 'teacher' }"
										@click="selectBtnClick('teacher')">
										<i class=""></i>
										<p style="font-size: 22px;margin-bottom: 1vh;font-weight: bold;">教师用户</p>
										<span style="font-size:13px">
											身为教师，您可以为您的班级创建考试，监督考试行为与查看成绩分析
										</span>
									</div>
								</div>
								<button class="theBtn" @click="next">继续</button>
							</el-carousel-item>

							<el-carousel-item class="carouselItem">
								<div style="font-size: 30px;margin-bottom: 2vh;font-weight: bold;">输入你的账号与密码</div>

								<el-form :model="form" status-icon :rules="rules" ref="formRef" label-width="80px">
									<el-form-item label="姓名" class="item" prop="name">
										<el-input v-model="form.name" autocomplete="off"></el-input>
									</el-form-item>
									<el-form-item label="账号" class="item" prop="account">
										<el-input v-model="form.account" autocomplete="off"></el-input>
									</el-form-item>
									<el-form-item label="密码" class="item" prop="password">
										<el-input type="password" v-model="form.password" autocomplete="off"
											show-password></el-input>
									</el-form-item>
									<el-form-item label="确认密码" class="item" prop="authenpassword">
										<el-input type="password" v-model="form.authenpassword" autocomplete="off"
											show-password>
										</el-input>
									</el-form-item>
								</el-form>

								<button class="theBtn" @click="next2('form')">继续</button>
							</el-carousel-item>
						
							<el-carousel-item class="carouselItem">
								<div>
								</div>
								<p style="font-size: 30px;margin-bottom: 1vh;font-weight: bold;">恭喜您注册成功</p>
								<p style="margin-top:2vh">
									您已成功注册您的慧测{{ (selectChara == 'student') ? '学生' : '教师' }}账号，现在可以使用慧测了
								</p>
								<button class="theBtn" @click="backToLogin">去登录</button>
							</el-carousel-item>
						</el-carousel>
					</div>
				</el-main>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const active = ref(1);
const selectChara = ref('student');
const preAccount = ref('');
const form = reactive({
    name: '',
    account: '',
    password: '',
    authenpassword: '',
    imgUrl: ''
});
const formRef = ref(null);
const loading = ref(false);
const carousel = ref(null)

const validateName = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('姓名不能为空'));
    } else {
        callback();
    }
};
const validateAccount = (rule, value, callback) => {
	if (value == '') {
		callback(new Error('账号不能为空'))
	}
	else {
		callback()
	}
}
const validatePass = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入密码'))
	} else {
		if (form.password !== '') {
			formRef.value.validateField('authenpassword');
		}
		callback()
	}
};
const validatePass2 = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请再次输入密码'))
	} else if (value !== form.password) {
		callback(new Error('两次输入密码不一致!'))
	} else {
		callback()
	}
};
const rules = reactive({
    			name: [
					{ validator: validateName, trigger: 'blur' }
				],
				account: [
					{ validator: validateAccount, trigger: 'blur' }
				],
				password: [
					{ validator: validatePass, trigger: 'blur' }
				],
				authenpassword: [
					{ validator: validatePass2, trigger: 'blur' }
				]
});

watch(() => router.currentRoute.value, () => {
    showpage();
});
const showpage = () => {
    const _obj = router.currentRoute.value.params;
    if (_obj.id != null) {
        preAccount.value = _obj.id;
        form.account = _obj.id;
        form.name = _obj.name;
        selectChara.value = _obj.identity;
    }
};

const register = async () => {
    try {
        const res = await axios({
            method: 'post',
            url: selectChara.value + '/register',
            params: {
                id: preAccount.value
            },
            data: {
                id: form.account,
                name: form.name,
                password: form.password,
                imageUrl: form.imgUrl
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.data.code === '200') {
            active.value++;
            carousel.value.next();
        } else {
            ElMessage.error(res.data.message);
            loading.value = false;
        }
    } catch (err) {
        console.error(err);
    }
}
const selectBtnClick = (type) => {
    selectChara.value = type;
};
const next = () => {
    active.value++;
    carousel.value.next();
};
const next2 =  (theForm) => {
    const valid =  formRef.value.validate();
    if (valid) {
        active.value++;
        register();
    } else {
        return false;
    }
};
const backToLogin = () => {
    if (selectChara.value === 'student') {
        router.push('/stulogin');
    } else {
        router.push('/tealogin');
    }
};
showpage();
</script>
<style scoped>
.mainDiv {
	margin-top: 5vh;
	height: 60vh;
	width: 80%;
	margin-left: auto;
	margin-right: auto;
	user-select: none;
}

.main {
	width: 100%;
	background-color: #EEEEEE;
}

.disabled {
	display: none;
}

.body {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

.header {
	width: 100%;
	text-align: center;
}

.theLogo {
	font-size: 300%;
	font-weight: bold;
	color: #409EFF;
}

.theSteps {
	margin-left: 16vw;
	margin-right: 16vw;
}

.center {
	width: 1000px;
	height: 600px;
	background-color: white;
	border-radius: 20px;
}

.carouselItem {
	text-align: center;
	height: 50vh;
}

.selectImg {
	margin-top: 5vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

.theBtn {
	width: 50%;
	color: white;
	background-color: #409EFF;
	border: none;
	font-size: 15px;
	padding: 15px 28px;
	border-radius: 6px;
	cursor: pointer;
	text-decoration: none;
	margin-top: 5vh;
}

.selectBtn {
	text-align: left;
	padding: 10px;
	height: 100%;
	width: 45%;
	background-color: white;
	border-width: 2px;
	border-style: solid;
	border-color: #C1C1C1;
	/* #409EFF */
	border-radius: 8px;
	cursor: pointer;
	text-decoration: none;
}

.selected {
	border-color: #409EFF;
}

.item {
	width: 50%;
	margin-left: 10vw;
	margin-right: 10vw;
	margin-bottom: 2vh;
}

.characteristic {
	width: 54%;
	height: 25vh;
	margin: auto;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>



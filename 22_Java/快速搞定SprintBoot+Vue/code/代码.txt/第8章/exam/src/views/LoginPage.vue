<template>
	<div class="main">
		<div class="header">
		</div>
		<div class="body">
			<div class="center">
				<div class="image_container">
					<img src="../assets/image/login.png" class="image">
				</div>
				<!-- 登陆框 -->
				<div class="login_container">
					<div class="login_box">
						<div class="loginName">
							<h2>选择用户</h2>
						</div>
						<div class="login">
							<div><button class="theBtn" @click="jumpToStuLogin">学生登录</button></div>
							<div style="margin-top:2vh"><button class="theBtn" @click="jumpToTeaLogin">教师登录</button></div>
							
							<div style="text-align: center;"><p>或者</p></div>
							<div><button class="theBtn" @click="jumpToRegister">注册</button></div>
							<button class="tinyBlue" @click="jumpToAdmLogin">管理员登录</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const jumpToStuLogin = () => {
    router.push('/stulogin');
};

const jumpToTeaLogin = () => {
    router.push('/tealogin');
};

const jumpToAdmLogin = () => {
    router.push('/adminlogin');
};

const jumpToRegister = () => {
    router.push('/register');
};

</script>

<style scoped>
.theBtn {
	width: 100%;
	height: 6vh;
	background-color: #409EFF;
	color: white;
	border: none;
	font-size: 16px;
	padding-left: 1vw;
	padding-right: 1vw;
	border-radius: 8px;
	cursor: pointer;
	display: inline-block;
	text-decoration: none;
	user-select: none;
}
.theBtn:hover {
	opacity: 0.8;
}

.theBtn:active {
	opacity: 1;
	background-color: #3897f7;
}

.tinyBlue{
	color: #409EFF;
	background-color: white;
	border: none;
	font-size: 12px;
	cursor: pointer;
	float:right;
	text-decoration: none;
	user-select: none;
	margin-top: 15px;
}


.main {
	width: 100%;
	background-color: #EEEEEE;
}

.body {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	/* background-color: ; */
}

.header {
	/* height: 6vh;
		background-color: #42B983;
		margin: 1%; */
}

.center {
	width: 1000px;
	height: 600px;
	/* border: 2px solid #3089DC; */
	background-color: white;
	/* margin-top: 50px; */
	border-radius: 20px;
	display: flex;
}

.image_container {
	/* width: 50%; */
	display: flex;
	align-items: center;
	justify-content: center;
}

.image {
	height: 100%;
	border-radius: 20px;
}

.login_container {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.login_box {
	width: 50%;
}

.login {
	width:100%
}

.tips {
	font-family: "Helvetica Neue", Helvetica, "PingFang SC";
	color: #909399;
	font-size: 12px;
}

.signIn {
	margin-top: 20px;
}

.signUp {
	margin-bottom: 30px;
}

.signUpMsg {
	font-size: 13px;
}

.signUpButton {
	font-size: 13px;
}
</style>

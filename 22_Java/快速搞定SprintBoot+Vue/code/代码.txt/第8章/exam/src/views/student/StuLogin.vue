<template>
    <div class="main">
      <div class="header"></div>
      <div class="body">
        <div class="center">
          <div class="image_container">
            <img src="../../assets/image/login.png" class="image">
          </div>
          <!-- 登陆框 -->
          <div class="login_container">
            <div class="login_box">
              <div style="display: flex;">
                <div class="img1" @click="backToChoice">
                  <img src="../../assets/image/back.png" style="width: 25px;" />
                </div>
              </div>
  
              <div class="loginName">
                <h2>学生登录</h2>
              </div>
              <div class="login">
                <div class="userMobile">
                  <p class="tips">学号：</p>
                  <el-input v-model="stuId" placeholder="请输入学号"></el-input>
                </div>
                <div class="userPassword">
                  <p class="tips">密码：</p>
                  <el-input type="password" placeholder="请输入密码" v-model="stuPassword" show-password></el-input>
                </div>
                <div class="signIn">
                  <el-button type="primary" style="width: 100%; height: 100rpx;" @click="signInBtn">登录</el-button>
                </div>
                <div class="signUp">
                  <p style="text-align: center; color: #909399; font-size: 12px;">或者</p>
                  <el-button type="primary" style="width: 100%; height: 100rpx;" @click="jumptoregister">注册</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import Cookies from 'js-cookie';

const stuId = ref('');
const stuPassword = ref('');
const router = useRouter();

// 返回方法
const backToChoice = () => {
  router.push('/login');
};

const jumptoregister = () => {
    router.push('/register') //点击注册按钮，跳转至注册页面
};

const signInBtn = async () => {
    if (stuId.value === '') {
        ElMessageBox.alert('账号不能为空', '错误', {
            confirmButtonText: '确定',
        });
    } else if (stuPassword.value === '') {
        ElMessageBox.alert('密码不能为空', '错误', {
            confirmButtonText: '确定',
        });
    } else {
        try {
            const res = await axios({
                method: 'post',
                url: '/student/login',
                params: {
                    id: stuId.value,
                    password: stuPassword.value,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (res.data.code === "400") {
                if (['账号不存在', '密码错误'].includes(res.data.message)) {
                    ElMessage.error(res.data.message);
                } else {
                    ElMessage.warning('账号未审核完成，请耐心等待');
                }
            } else if (res.data.code === "200") {
                if (res.data.result.certified === "通过") {
                    Cookies.set("id", res.data.result.id);
                    Cookies.set("name", res.data.result.name);
                    ElMessage.success('登录成功');
                    router.push('/studentmain');
                } else {
                    ElMessageBox.alert('审核未通过，是否重新注册', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            router.push({
                                name: 'register',
                                params: {
                                    identity: "student",
                                    id: res.data.result.id,
                                    name: res.data.result.name,
                                }
                            });
                        },
                        showClose: false,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
};
</script>


<style scoped>
.main {
	width: 100%;
	background-color: #EEEEEE;
}

.body {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;


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

.img1:hover img {
	content: url(../../assets/image/backhover.png);
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

<template>
    <div class="main">
        <div class="header">
        </div>
        <div class="body">
            <div class="center">
                <div class="image_container">
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
                            <h2>管理员登录</h2>
                        </div>
                        <div class="login">
                            <div class="userMobile">
                                <p class="tips">账号：</p>
                                <el-input v-model="adminId" placeholder="请输入账号"></el-input>
                            </div>
                            <div class="userPassword">
                                <p class="tips">密码：</p>
                                <el-input placeholder="请输入密码" v-model="adminPassword" size="large" show-password>
                                </el-input>
                            </div>
                            <div class="signIn">
                                <el-button type="primary" style="width: 100%;height: 100rpx;" @click="signInBtn">
                                    登录</el-button>
                            </div>
                            <div class="signUp">
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
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();

const adminId = ref('');
const adminPassword = ref('');

// 返回登录选择页面
const backToChoice = () => {
    router.push('/login');
};

// 管理员登录
const signInBtn = async () => {
    if (adminId.value === '') {
        ElMessageBox.alert('账号不能为空', '错误', {
            confirmButtonText: '确定',
        });
    } else if (adminPassword.value === '') {
        ElMessageBox.alert('密码不能为空', '错误', {
            confirmButtonText: '确定',
        });
    } else {
        try {
            const res = await axios({
                method: 'post',
                url: '/admin/login',
                params: {
                    id: adminId.value,
                    password: adminPassword.value,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (res.data.code === "400") {
                if (res.data.message === "账号不存在" || res.data.message === '密码错误') {
                    ElMessage.error(res.data.message);
                } else {
                    ElMessage.warning('账号未审核完成，请耐心等待');
                }
            } else if (res.data.code === "200") {
                ElMessage.success('登录成功');
                router.push('/adminmain');
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
    background-color: white;
    border-radius: 20px;
    display: flex;
}

.image_container {
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
    height:10vh;
    margin-bottom: 30px;
}

.signUpMsg {
    font-size: 13px;
}

.signUpButton {
    font-size: 13px;
}
</style>

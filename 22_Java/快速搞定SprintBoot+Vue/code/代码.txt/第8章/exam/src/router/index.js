import { createRouter, createWebHashHistory } from 'vue-router';

// 导入你的组件
import login from "../views/LoginPage.vue";
import register from "../views/RegisterPage.vue";
import papermake from "../views/teacher/PaperMake.vue"
import stulogin from "../views/student/StuLogin.vue"
import tealogin from "../views/teacher/TeaLogin.vue"
import examing from "../views/student/StuExaming.vue"
import correct from "../views/teacher/CorrectPage.vue"

import studentmain from "../components/StudentMain.vue"
import stuallscore from "../views/student/StuAllScore.vue"
import stuallexam from "../views/student/StuAllExam.vue"
import stuallclass from "../views/student/StuAllClass.vue"
import stuallmes from "../views/student/StuAllMes.vue"
import stuinfo from "../views/student/StuInfo.vue"
import stuexaming from "../views/student/StuExaming.vue"

import teachermain from "../components/TeacherMain.vue"
import classallexam from "../views/teacher/ClassAllExam.vue"
import classinfo from "../views/teacher/ClassInfo.vue"
import classscore from "../views/teacher/ClassScore.vue"
import correctlist from "../views/teacher/CorrectList.vue"
import teacherinfo from "../views/teacher/TeacherInfo.vue"

import adminmain from "../components/AdminMain.vue"
import adminaccount from "../views/admin/AdminAccount.vue"
import adminques from "../views/admin/AdminQues.vue"
import adminlogin from "../views/admin/AdminLogin.vue"


import monitorteacher from "../views/teacher/MonitorTeacher.vue"

// 路由规则
const routes = [
    {
        path: "/",
        redirect: { name: "login" }
    },
    {
		path: "/login",
		name: "login",
		component: login,
	},
	{
		path: "/register",
		name: "register",
		component: register,
	},
	{
		path: "/stulogin",
		name: "stulogin",
		component: stulogin,
	},
	{
		path: "/tealogin",
		name: "tealogin",
		component: tealogin,
	},
	{
		path: "/adminlogin",
		name: "adminlogin",
		component: adminlogin,
	},
	{
		path: "/papermake",
		name: "papermake",
		component: papermake,
	},
	{
		path: "/examing",
		name: "examing",
		component: examing,
	},
	{
		path: "/correct",
		name: "correct",
		component: correct,
	},
	{
		path: "/studentmain",
		name: "studentmain",
		component: studentmain,
		children: [{
				name:'stuallscore',
				path: '/stuallscore',
				component: stuallscore
			},
			{
				name:'stuallexam',
				path: '/stuallexam',
				component: stuallexam
			},
			{
				name:'stuallclass',
				path: '/stuallclass',
				component: stuallclass
			},
			{
				name:'stuallmes',
				path: '/stuallmes',
				component: stuallmes
			},
			{
				name:'stuinfo',
				path: '/stuinfo',
				component: stuinfo
			}
		]
	},

	{
		path: "/stuexaming",
		name: "stuexaming",
		component: stuexaming,
	},

	{
		path: "/teachermain",
		name: "teachermain",
		component: teachermain,
		children: [{
				name:'classallexam',
				path: '/classallexam',
				component: classallexam
			},
			{
				name:'classinfo',
				path: '/classinfo',
				component: classinfo
			},
			{
				name:'classscore',
				path: '/classscore',
				component: classscore
			},
			{
				name:'correctlist',
				path: '/correctlist',
				component: correctlist
			},
			{
				name:'teacherinfo',
				path: '/teacherinfo',
				component: teacherinfo
			},
			//教师监考
			{
				path:'/monitorteacher',
				component:monitorteacher,
				name:'monitorteacher'
			},
		]
	},
	{
		path: "/adminmain",
		name: "adminmain",
		component: adminmain,
		children: [{
				name:'adminques',
				path: '/adminques',
				component: adminques
			},
			{
				name:'adminaccount',
				path: '/adminaccount',
				component: adminaccount
			},
		]
	},
];

// 创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;

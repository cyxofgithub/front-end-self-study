<template>
	<div class="allmessage" v-if="List.length!==0">

<!--考试通知-->
<el-card :class="item.type === '成绩通知'?'testMess':'scoMess'" v-for="item in List">
	<el-row>
		<el-col :span="22">
	<el-row><span style="color:#ffffff; font-size: 20px;">{{item.type}}</span>
	&#12288;
	<span style="color:#ffffff;
	font-size: 14px;
	font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">{{item.content.class_name}}
	</span></el-row>
	
	<span style="color:#ffffff;font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">{{item.content.start_time}}&#32;——&#32;{{item.content.end_time}}</span>
		&#32;
	<span style="color:#ffffff;font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">进行</span>
		&#32;
	<span style="color:#ffffff;font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">《{{item.content.exam_name}}》</span>
	</el-col>
	<el-col :span="2">
	<span style="color:#ffffff; font-size: 40px;text-align: center;padding-top: 20px;">{{item.content.total_point}}</span>
	</el-col>
</el-row>
	</el-card>

</div>
<div v-else>
	<el-empty description="暂无消息"></el-empty>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const List = ref([]);

const getData = async () => {
    try {
        const res = await axios.get("/message/getMessageList");
        console.log(res.data.result);
        res.data.result.forEach(item => {
            const obj = JSON.parse(item.content);
            List.value.push({
                content: obj,
                type: item.type
            });
        });
        console.log(List.value);
    } catch (err) {
        console.error(err);
    }
};

onMounted(() => {
    getData();
});
</script>
<style scoped>
.testMess{
	margin: 5px;
	background-color: rgb(149, 212, 117);
	height: 120px;
}

.scoMess{
	margin: 5px;
	background-color: rgb(121, 187, 255);
	height: 120px;
}
</style>

<template>
	<div class="allmessage" v-if="List.length!==0">

<!--考试通知-->
<el-card :class="item.type === '成绩通知'?'testMess':'scoMess'" v-for="item in List">
	<el-row>
		<el-col :span="22">
	<el-row><span >{{item.type}}</span>
	&#12288;
	<span>{{item.content.class_name}}
	</span></el-row>
	
	<span>{{item.content.start_time}}&#32;——&#32;{{item.content.end_time}}</span>
		&#32;
	<span>进行</span>
		&#32;
	<span>《{{item.content.exam_name}}》</span>
	</el-col>
	<el-col :span="2">
	<span>{{item.content.total_point}}</span>
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
        res.data.result.forEach(item => {
            const obj = JSON.parse(item.content);
            List.value.push({
                content: obj,
                type: item.type
            });
        });
    } catch (err) {
        console.error(err);
    }
};

onMounted(() => {
    getData();
});
</script>

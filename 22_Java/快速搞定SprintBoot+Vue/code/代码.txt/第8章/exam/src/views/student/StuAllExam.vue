<template>
	<div class="allexam">

		<el-table ref="filterTable" :data="tableData" style="width: 100% " :row-style="{height: '70px'}"
			:row-class-name="tableRowClassName">
			<el-table-column prop="lesson.name" label="班级" align="center"></el-table-column>
			<el-table-column prop="startTime" label="考试开始时间" align="center"></el-table-column>
			<el-table-column prop="endTime" label="考试结束时间" align="center"></el-table-column>
			<el-table-column prop="name" label="考试科目" align="center"></el-table-column>
			<el-table-column prop="status" label="考试状态" align="center"
				:filters="[{ text: '正在考试', value: '正在考试' }, { text: '时间未到', value: '时间未到' },{ text: '已结束', value: '已结束' },{ text: '已批阅', value: '已批阅' }]"
				:filter-method="filterStatus" filter-placement="bottom-end">
				<template v-slot="scope">
					<el-tag v-if="scope.row.status !== '正在考试'" :type="scope.row.status === '时间未到' ? 'success' : 'info'"
						disable-transitions>{{scope.row.status}}
					</el-tag>
					<el-button v-if="scope.row.status === '正在考试'" type="success" size="mini"
						@click="toStuExaming(scope.row.id)">
						参加考试
					</el-button>
				</template>
			</el-table-column>

		</el-table>
	</div>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const tableData = ref([]);

const clearFilter = () => {
    const filterTable = ref(null);
    if (filterTable.value) {
        filterTable.value.clearFilter();
    }
};

const filterStatus = (value, row) => {
    return row.status === value;
};

const toStuExaming = async (this_examId) => {
    try {
        const res = await axios.get("/examing/getExamAccess?examId=" + this_examId);
        console.log(res);
        if (res.data.code == '200') {
            router.push({
                path: '/stuexaming',
                query: { examId: this_examId }
            });
        } else {
            ElMessage({
                message: res.data.message,
                type: 'info'
            });
        }
    } catch (error) {
        console.error(error);
    }
};

const getData = async () => {
    try {
        const res = await axios.get("/exam/getByStudent");
        console.log(res.data.result);
        tableData.value = res.data.result;
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    getData();
});
</script>

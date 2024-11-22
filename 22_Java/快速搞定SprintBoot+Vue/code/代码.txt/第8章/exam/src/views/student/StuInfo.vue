<template>
    <div>
      <el-row :gutter="20" style="margin-top:10px;">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <template v-slot:header>
                <span>个人信息</span>
              </template>
              <div class="imgplace">
                <el-image :src="src"></el-image>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <template v-slot:header>
                <span>基本资料</span>
              </template>
              <div class="infoplace">
                <div class="text item">姓名：{{ name }}</div>
                <div class="text item">账号：{{ stunum }}</div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
  

  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const src = ref('');
  const name = ref('');
  const stunum = ref('');
  
  const getData = async () => {
    try {
      const response = await axios.get("/student/getStudentInfo");
      console.log(response.data.result);
      name.value = response.data.result.name;
      stunum.value = response.data.result.id;
      src.value = response.data.result.imageUrl;

    } catch (error) {
      console.error(error);
    }
  };
  
  onMounted(() => {
    getData();
  });
  </script>
  



<style scoped>
	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both;

	}

	.box-card {
		width: 100%;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}
</style>

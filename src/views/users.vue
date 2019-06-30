<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="8">
        <div style="margin: 15px 0;">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4" class="addUser">
        <div style="margin: 15px 0;">
          <el-button type="success" plain>添加用户</el-button>
        </div>
      </el-col>
    </el-row>

    <template>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="address" label="用户状态">
          <template v-slot="{row}">
            <el-switch v-model="row.type" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
            <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
            <el-button type="success" plain size="mini" icon="el-icon-check">添加用户</el-button>

        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      params: {
        pagenum: 1,
        pagesize: 5
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(res => {
      console.log(res);
      if (res.data.meta.status === 200) {
        this.userList = res.data.data.users;
      }
    });
  }
};
</script>

<style>
.el-main .el-breadcrumb {
  background-color: #d4dae0;
  padding-left: 10px;
  line-height: 50px;
  font-size: 16px;
}
/* .main .users .addUser {
    margin-top: 15px;
} */
</style>



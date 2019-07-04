<template>
  <el-container class="home-container">
    <el-header class="home-header">
      <el-row type="flex" align="middle">
        <el-col :span="6">
          <img src="../assets/itlogo.png" alt />
        </el-col>
        <el-col>
          <h1>电商后台管理系统</h1>
        </el-col>
        <el-col :span="6">
          <div>
            欢迎上海前端39期钻石会员
            <a href="javascript:;" class="logout" @click="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="200px" class="home-aside">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          :unique-opened="true"
        >
          <el-submenu :index="item.order + ''" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item v-for="item2 in item.children" :key="item2.id" :index=" '/' + item2.path">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      menus: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/menus",
      method: "get",
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(({ data: { data, meta } }) => {
      if (meta.status === 200) {
        // console.log(data);
        this.menus = data;
      }
    });
  },
  methods: {
    logout() {
      this.$confirm("你确定要退出系统吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 1. 删除localStorage中的myToken
          localStorage.removeItem("token");
          // 2. 跳转到登录组件
          this.$router.push("login");
          // 3. 给一个退出的提示
          this.$message.success("退出成功了");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "退出取消了"
          });
        });
    }
  }
};
</script>


<style >
.home-container {
  background-color: #eaeef1;
  height: 100%;
}
.home-container .home-header {
  background-color: #b3c0d1;
  padding-left: 0;
}
.home-header img {
  width: 200px;
}

.home-header h1 {
  margin: 0;
  text-align: center;
  color: #fff;
  font-size: 28px;
  font-weight: 700;
}
.home-header div {
  min-width: 235px;
  font-weight: bold;
}
.home-header .logout {
  color: #daa520;
}

.home-aside {
  background-color: #545c64;
}
.el-main{
  background-color: #eee;
}
</style>



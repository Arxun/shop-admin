<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form
        class="login-form"
        ref="form"
        :model="form"
        label-width="80px"
        label-position="top"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
// import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 18,
            message: "密码长度必须在 6 到 18 个字符之间",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    async submitForm(form) {
      let vaild = await this.$refs[form].validate();

      if (vaild) {
        try {
          let res = await this.$http({
            url: "login",
            method: "post",
            data: this.form
          });

          if (res.data.meta.status == 200) {
            localStorage.setItem("token", res.data.data.token);
            this.$message({
              type: "success",
              message: res.data.meta.msg,
              duration: 1000
            });
            this.$router.push("/home");
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: "error",
              duration: 1000
            });
          }
        } catch (e) {
          console.log("发送请求失败");
        }
      } else {
        return false;
      }
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    }
  }
};
</script>



<style>
.row-bg {
  height: 100%;
  background-color: #2d434c;
}
.login-form {
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 15px;
  min-width: 400px;
}
</style>


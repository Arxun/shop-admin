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
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="keyword"
            @keyup.13.native="search"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4" class="addUser">
        <div style="margin: 15px 0;">
          <el-button type="success" plain @click="dialogAddUser = true">添加用户</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="address" label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit"
            @click="openEditUserDialog(row.id)"
          ></el-button>

          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUser(row.id)"></el-button>

          <el-button
            type="success"
            plain
            size="mini"
            icon="el-icon-check"
            @click="openRoleDialog(row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentpage"
      :page-size="pagesize"
      @current-change="onPageChange"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogAddUser" @close="$refs.addruleForm.resetFields();">
      <el-form label-width="100px" :model="addUserData" :rules="rules" ref="addruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input autocomplete="off" v-model="addUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input autocomplete="off" show-password type="password" v-model="addUserData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input autocomplete="off" v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogEditUser">
      <el-form label-width="100px" :model="editUserData" :rules="editrules" ref="editruleForm">
        <el-form-item label="用户名">
          <el-tag type="info" v-text="editUserData.username"></el-tag>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input autocomplete="off" v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogeditUser = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="RoledialogShow">
      <el-form label-width="100px" :model="assionRoleData">
        <el-form-item label="用户名">
          <el-tag type="info" v-text="assionRoleData.username"></el-tag>
        </el-form-item>

        <el-form-item>
          <el-select v-model="assionRoleData.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="RoledialogShow = false">取 消</el-button>
        <el-button type="primary" @click="assionRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyword: "",
      dialogAddUser: false,
      addUserData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },

      dialogEditUser: false,
      editUserData: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      editrules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "请输入邮箱",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },
      RoledialogShow: false,
      assionRoleData: {
        username: "",
        rid: ""
      },
      roleList: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http({
        url: "/users",
        params: {
          query: this.keyword,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      }).then(res => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users;
          this.total = res.data.data.total;
        }
      });
    },
    onPageChange(page) {
      this.currentpage = page;

      this.getUserList();
    },
    async toggleState(user) {
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: "put"
      });

      if (res.data.meta.status == 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 1000
        });

        //后台请求出错后，状态修改未成功
        //所以页面上的switch也不应该被修改，我们把他修改为原来的状态
        user.mg_state = !user.mg_state;
      }
    },
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await this.$http({
          url: `users/${id}`,
          method: "delete"
        });
        if (res.data.meta.status == 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.currentpage = 1;
          this.getUserList();
        }
      } catch (e) {
        this.$message({
          type: "error",
          message: "已取消删除",
          duration: 1000
        });
      }
    },
    async search() {
      this.getUserList();
    },
    async addUser() {
      try {
        await this.$refs.addruleForm.validate();
        //表单校验成功之后发的ajax
        let res = await this.$http({
          url: "/users",
          method: "post",
          data: this.addUserData
        });
        if (res.data.meta.status == 201) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.getUserList();
          this.dialogAddUser = false;
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (e) {}
    },
    async openEditUserDialog(id) {
      this.dialogEditUser = true;
      let res = await this.$http({
        url: `users/${id}`
      });

      this.editUserData = res.data.data;
    },
    async editUser() {
      try {
        await this.$refs.editruleForm.validate();
        let res = await this.$http({
          url: `/users/${this.editUserData.id}`,
          method: "put",
          data: {
            mobile: this.editUserData.mobile,
            email: this.editUserData.email
          }
        });

        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.getUserList();

          this.dialogEditUser = false;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
      } catch (e) {}
    },
    async openRoleDialog(row) {
      this.RoledialogShow = true;
      let res = await this.$http({
        url: `/users/${row.id}`
      });

      if (res.data.meta.status == 200) {
        console.log(res);
        this.assionRoleData = res.data.data;
      }
      let res2 = await this.$http({
        url: `roles`
      });

      this.roleList = res2.data.data;
    },
    async assionRole() {
      let res = await this.$http({
        url: `users/${this.assionRoleData.id}/role`,
        method: "put",
        data: {
          rid: this.assionRoleData.rid
        }
      });

      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });
      this.RoledialogShow = false;
    }
  }
};
</script>

<style scoped>
.el-main .el-breadcrumb {
  background-color: #d4dae0;
  padding-left: 10px;
  line-height: 50px;
  font-size: 16px;
  border-radius: 10px;
}
</style>



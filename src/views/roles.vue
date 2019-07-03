<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理权限</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="roleList" stripe style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row type="flex" class="item1" v-for="item1 in row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag closable @close="delRight(row,item1.id)">{{item1.authName}}</el-tag>
              <span class="el-icon-arrow-right"></span>
            </el-col>
            <el-col>
              <el-row type="flex" class="item2" v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag type="success" closable @close="delRight(row,item2.id)">{{item2.authName}}</el-tag>
                  <span class="el-icon-arrow-right"></span>
                </el-col>
                <el-col>
                  <el-tag
                    class="item3"
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="delRight(row,item3.id)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>

          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>

          <el-button
            type="success"
            plain
            size="mini"
            icon="el-icon-check"
            @click="openrightsdialogisshow(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="角色授权" :visible.sync="rightsdialogisshow">
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedRights"
        :default-expand-all="true"
        :props="defaultProps"
        ref="tree"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsdialogisshow = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      rightsdialogisshow: false,
      rightsList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedRights: [],
      currentEditRoleId: -1
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      let res = await this.$http({
        url: "roles"
      });
      //   console.log(res);
      this.roleList = res.data.data;
    },
    async openrightsdialogisshow(row) {
      this.currentEditRoleId = row.id;
      this.rightsdialogisshow = true;
      let res = await this.$http({
        url: "rights/tree"
      });
      console.log(res);
      this.rightsList = res.data.data;

      //需要让tree组件中默认选中当前角色拥有的权限信息
      //把row中所有的权限的id组成一个数组

      let arr3 = [];

      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arr3.push(item3.id);
          });
        });
      });
      this.checkedRights = [...arr3];
    },
    async updateRoleRights() {
      let ids = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ].join(",");

      let res = await this.$http({
        url: `roles/${this.currentEditRoleId}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      });

      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });
      this.getRoleList();

      this.rightsdialogisshow = false;
    },
    //低配版本
    async delRight(row, id) {
      const res = await this.$http({
        url: `/roles/${row.id}/rights/${id}`,
        method: "delete"
      });
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });

      this.getRoleList();
    }

    // getIndex(index) {
    //     // console.log(index);
    //   let arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    //   return arr[index];
    // }
  }
};
</script>

<style scoped>
.breadcrumb {
  background-color: #d4dae0;
  padding-left: 10px;
  line-height: 50px;
  font-size: 16px;
  border-radius: 10px;
  margin-bottom: 15px;
}
.item1 {
  padding: 10px 0;
  border-bottom: 1px dashed #ccc;
}
.item1:last-child {
  border-bottom: none;
}
.item2 {
  margin-bottom: 15px;
}
.item3 {
  margin-right: 10px;
}
</style>


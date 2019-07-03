<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="rightsList" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>

      <el-table-column label="层级">
        <template v-slot="{row}">
          <span>{{row.level | levelfilter}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  filters: {
    levelfilter(value) {
      switch (value) {
        case "0":
          return "一级";
        case "1":
          return "二级";
        case "2":
          return "三级";
      }
    }
  },
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getrightsList();
  },
  methods: {
    async getrightsList() {
      let res = await this.$http({
        url: `rights/list`
      });

      if (res.data.meta.status == 200) {
        console.log(res);
        this.rightsList = res.data.data;
      }
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

  margin-bottom: 20px;
}
</style>


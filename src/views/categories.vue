<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain>添加分类</el-button>
    <el-table :data="categoriesList" stripe style="width: 100%">
      <!-- 此处不会，明天在看视频，弄清楚内部的属性 -->

      <!-- file-icon就是叶子节点的图标
        foider-icon指的就是课展开的项的图标
        prop指的就是当前列要显示的数据的属性名称
        label指的就是表头
        treekey节点的唯一标识
        parentkey数据的父节点
        childkey当前节点的所有子节点的属性名字 默认是children
        indent-size：缩进距离
      level-key 设置为数据中标识层级的属性-->
      <el-table-tree-column
        file-icon="el-icon-notebook-2"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        tree-key="cat_id"
        parent-key="cat_pid"
        :indent-size="30"
        level-key="cat_level"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="180">
        <template v-slot="{row}">{{row.cat_deleted ? "否":"是"}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级" width="180"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>
<script>
const ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoriesList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    pageChange(currentPage){
      this.pagenum = currentPage
      this.getCategoriesList()
    },
    async getCategoriesList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          total: 0
        }
      });
      // console.log(res);
      this.categoriesList = res.data.data.result;
      this.total = res.data.data.total;
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

  margin-bottom: 15px;
}
</style>


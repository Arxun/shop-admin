<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="openAddCateDialog">添加分类</el-button>
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

    <el-dialog title="添加分类" :visible.sync="addCateShow">
      <el-form label-width="100px" :model="addCateFormDate" ref="addCateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFormDate.cat_name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="pidArr">
          <el-cascader
            v-model="addCateFormDate.pidArr"
            :options="cateOptions"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateShow = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
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
      total: 0,
      addCateShow: false,
      addCateFormDate: {
        cat_name: "",
        pidArr: []
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    async addCate() {
      let cat_name = this.addCateFormDate.cat_name;
       let cat_level = this.addCateFormDate.pidArr.length;
      let cat_pid =
        this.addCateFormDate.pidArr.pop() || 0

     

      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_name,
          cat_pid,
          cat_level
        }
      });
      console.log(res);
      if (res.data.meta.status == 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.addCateShow = false;
        // this.categoriesList.push(res.data.data.)
        this.$refs.addCateForm.resetFields();
        this.getCategoriesList();
      }
    },
    async openAddCateDialog() {
      let res = await this.$http({
        url: "categories",
        // 此时级联菜单里可能会手动添加三级分类名，所以只需要请求来前两级就行
        params: {
          type: 2
        }
      });

      console.log(res);
      this.cateOptions = res.data.data;
      this.addCateShow = true;
    },

    pageChange(currentPage) {
      this.pagenum = currentPage;
      this.getCategoriesList();
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


<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="success" plain @click="addGoods">添加商品</el-button>
    <el-table ref="singleTable" :data="goodsList" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="120"></el-table-column>
      <el-table-column property="goods_price" label="商品价格" width="120"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="{row}">
          <span>{{row.add_time | filterTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>

        <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
      </el-table-column>
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
import moment from "moment";
export default {
  filters: {
    filterTime(value) {
      return moment.unixa(value).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    addGoods() {
      this.$router.push("/goods-add");
    },
    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      if (res.data.meta.status == 200) {
        console.log(res);
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      }
    },
    pageChange(currentPage) {
      this.pagenum = currentPage;
      this.getGoodsList();
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


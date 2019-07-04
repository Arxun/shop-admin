<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <!-- v-model:用来绑定当前正在激活的标签的name -->
    <el-tabs
      tab-position="left"
      style=" margin-top:20px"
      @tab-click="changeTab"
      v-model="activeName"
    >
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="form" :model="addGoodsFormData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsFormData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsFormData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsFormData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsFormData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsFormData.goods_catarr"
              :options="cateOptions"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addGoodsFormData.ispromotion" label="1">是</el-radio>
            <el-radio v-model="addGoodsFormData.ispromotion" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1,'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-success="picUploadSuccess"
          :headers="headers"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quillEditor v-model="addGoodsFormData.goods_introduce"></quillEditor>

        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      activeStep: 0,
      activeName: "basic",
      addGoodsFormData: {
        goods_name: "",
        goods_catarr: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        ispromotion: 0
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  created() {
    this.getcateOptions();
  },
  methods: {
    async addGoods() {
      let newGoods = {
        goods_cat: this.addGoodsFormData.goods_catarr.join(","),
        goods_name: this.addGoodsFormData.goods_name,
        goods_price: this.addGoodsFormData.goods_price,
        goods_number: this.addGoodsFormData.goods_number,
        goods_weight: this.addGoodsFormData.goods_weight,
        goods_introduce: this.addGoodsFormData.goods_introduce,
        pics: this.addGoodsFormData.pics,
        is_promote: this.addGoodsFormData.ispromotion
      };

      let res = await this.$http({
        url: "goods",
        method: "post",
        data: newGoods
      });

      //   console.log(res);
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });
      this.$router.push("/goods");
    },
    picUploadSuccess(res) {
      //   console.log(res);
      this.addGoodsFormData.pics.push({ pic: res.data.tmp_path });
    },
    async getcateOptions() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3
        }
      });
      //   console.log(res);
      if (res.data.meta.status == 200) {
        this.cateOptions = res.data.data;
      }
    },
    changeTab(tab) {
      //   console.log(tab);
      this.activeStep = +tab.index;
    },
    next(index, name) {
      this.activeStep = index;
      this.activeName = name;
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
.quill-editor {
  background-color: #fff;
}
</style>

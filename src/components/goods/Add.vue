<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps :active="activeIdx - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIdx"
          :before-leave="beforeTableLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="goodsCatsList"
                :props="goodsCatsProps"
                @change="catsHandleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :label="cb"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action图片要上传的api地址 -->
            <!-- handlePreview 触发预览图片效果 -->
            <!-- handleRemove 图片移除触发 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="setHeaders"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="previewdialogVisible"
      width="50%"
    >
      <img :src="imgURL" alt="" class="preimg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIdx: '0',
      //   添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      goodsCatsList: [],
      goodsCatsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      //   动态参数列表
      manyTableData: [],
      //   静态属性列表
      onlyTableData: [],
      //   上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      setHeaders: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      previewdialogVisible: false,
      imgURL: '',
    }
  },
  created() {
    this.getGoodsCatsList()
  },
  methods: {
    async getGoodsCatsList() {
      const { data: res } = await this.$http('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   console.log(res.data)
      this.goodsCatsList = res.data
    },
    catsHandleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      //   console.log(this.addForm.goods_cat)
    },
    // 组织标签页的切换
    beforeTableLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 选中tab栏时触发
    async tabClicked() {
      // console.log(this.activeIdx);
      // 如果this.activeIdx === 1说明访问的是动态参数列表
      if (this.activeIdx === '1') {
        const { data: res } = await this.$http(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' },
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        console.log(res.data)
        this.manyTableData = res.data
      } else if (this.activeIdx === '2') {
        const { data: res } = await this.$http(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' },
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    handlePreview(file) {
      this.previewdialogVisible = true
      this.imgURL = file.response.data.url
    },
    handleRemove(file) {
      // 获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中 找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      //调用splice方法把图片信息对象 从pics数组中删掉
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    handleSuccess(res) {
      // 拼接得到一个图片信息对象
      const picInfo = { pic: res.data.tmp_path }
      // 将图片信息对象存入pic数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics);
    },
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项!')
        // 深拷贝
        // lodash cloneDeep(obj)
        let deepAddForm = _.cloneDeep(this.addForm)
        deepAddForm.goods_cat = deepAddForm.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          })
        })
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          })
        })
        deepAddForm.attrs = this.addForm.attrs
        const {data:res} = await this.$http.post('goods',deepAddForm)
        if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        console.log(res);
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>
<style lang='less' scoped>
.el-checkbox {
  margin: 10px !important;
}
.preimg {
  width: 100%;
}
.quill-editor {
  margin: 10px 0;
}
</style>
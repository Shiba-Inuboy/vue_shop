<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treetable"
        :data="cartList"
        :columns="columns"
        :selection-type="false"
        show-index
        :expand-type="false"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <template slot="do" slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="getEditCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类的对话框 -->
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      width="50%"
      @close="resetAddCate"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCatRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options 用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedkeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改分类"
      :visible.sync="editCateVisible"
      width="50%"
      @close="resetEdit"
    >
      <el-form
        :model="editCateForm"
        :rules="addCatRules"
        ref="editCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editCateForm: {},
      editCateVisible: false,
      // 选中的父级分类的id数组
      selectedkeys: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      //父级分类的列表
      parentCateList: [],
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级默认要一级分类
        cat_level: 0,
      },
      // 控制分类对话框的显示
      addCateVisible: false,
      addCatRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 商品分类的数据列表 默认为空
      cartList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //   为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //   表示把当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          template: 'do',
        },
      ],
    }
  },
  created() {
    this.getCartList()
  },
  methods: {
    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`categories/${id}`)
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getCartList()
    },
    editCate() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name,
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editCateVisible = false
        this.getCartList()
      })
    },
    async getEditCate(id) {
      const { data: res } = await this.$http(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editCateForm = res.data
      this.editCateVisible = true
    },
    resetEdit() {
      this.$refs.editCateRef.resetFields()
    },
    resetAddCate() {
      this.$refs.addCateRef.resetFields()
      this.selectedkeys = []
      this.addCateForm = {}
    },
    // 点击按钮添加新的分类
    addCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        console.log(res.data)
        this.addCateVisible = false
        this.getCartList()
      })
    },
    // 选择项变化触发这个函数
    parentCateChange() {
      // 如果selectedkeys数组中的length大于0 证明选中了父级分类
      // 反之就说明没有选中任何父级分类
      if (this.selectedkeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedkeys[
          this.selectedkeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedkeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 点击添加弹出对话框
    showAddCate() {
      this.getParentCateList()
      this.addCateVisible = true
    },
    //  获取 商品分类的数据列表
    async getCartList() {
      const { data: res } = await this.$http('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.cartList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCartList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getCartList()
    },
  },
}
</script>
<style lang='less' scoped>
.treetable {
  margin: 10px 0 !important;
}
.el-cascader {
  width: 100%;
}
</style>
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedkeys"
            :options="cateList"
            :props="cascaderProps"
            @change="CateChange"
            clearable
          ></el-cascader>
          <!-- tab页签区域 -->
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many">
              <!-- 添加参数的按钮 -->
              <el-button
                type="primary"
                size="mini"
                :disabled="idBtndisabled"
                @click="addVisible = true"
                >添加参数</el-button
              >
              <!-- 动态参数表格 -->
              <el-table :data="manyTabalData" border stripe>
                <!-- 这是展开行 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-tag
                      @close="closeTag(i, scope.row)"
                      closable
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      >{{ item }}</el-tag
                    >
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <!-- 这是一个索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="editGetData(scope.row.attr_id)"
                      >修改</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteCate(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
              <!-- 添加属性的按钮 -->
              <el-button
                type="primary"
                size="mini"
                :disabled="idBtndisabled"
                @click="addVisible = true"
                >添加属性</el-button
              >
              <el-table :data="onlyTabalData" border stripe>
                <!-- 这是展开行 -->
                <el-table-column type="expand">
                                      <template slot-scope="scope">
                    <el-tag
                      @close="closeTag(i, scope.row)"
                      closable
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      >{{ item }}</el-tag
                    >
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <!-- 这是一个索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="属性名称">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="editGetData(scope.row.attr_id)"
                      >修改</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteCate(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addVisible"
      width="50%"
      @close="addChange('addFormRef')"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editVisible"
      width="50%"
      @close="addChange('editFormRef')"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectedkeys: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      //   被激活的页签的名称
      activeName: 'many',
      //   动态参数的数据
      manyTabalData: [],
      //   静态属性的数据
      onlyTabalData: [],
      addVisible: false,
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      editVisible: false,
      editForm: {},
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async saveAttrVals(item) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: item.attr_sel,
          attr_vals: item.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('修改参数项成功')
    },
    async closeTag(idx, row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      if (confirmResult !== 'confirm') return this.$message.info('已取消修改')
      row.attr_vals.splice(idx, 1)
      this.saveAttrVals(row)
    },
    //   文本框失去焦点或按下enter
    handleInputConfirm(item) {
      if (item.inputValue.trim().length === 0) {
        item.inputValue = ''
        item.inputVisible = false
        return
      }
      item.attr_vals.push(item.inputValue.trim())
      item.inputValue = ''
      item.inputVisible = false
      this.saveAttrVals(item)
    },
    // 点击按钮展示文本输入框
    showInput(item) {
      item.inputVisible = true
      //   让文本框自动获得焦点
      // nextTick 就是当页面上元素被重新渲染之后 才会执行回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    addChange(refName) {
      this.$refs[refName].resetFields()
    },
    // 删除分类信息
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getParamsData()
    },
    // 修改分类信息
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editVisible = false
        this.getParamsData()
      })
    },
    // 获取编辑后的数据
    async editGetData(id) {
      const { data: res } = await this.$http(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editVisible = true
    },
    //   点击弹出添加动态参数对话框
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // console.log(res)
        this.getParamsData()
        this.addVisible = false
      })
    },
    async getCateList() {
      const { data: res } = await this.$http('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   console.log(res.data)
      this.cateList = res.data
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedkeys.length !== 3) {
        this.selectedkeys = []
        this.manyTabalData = []
        this.onlyTabalData = []
        return
      }
      // 证明选中的是三级分类
      const { data: res } = await this.$http(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTabalData = res.data
      } else {
        this.onlyTabalData = res.data
      }
    },
    CateChange() {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
      //   console.log(this.activeName)
    },
  },
  computed: {
    //   如果按钮被禁用则返回true 否则返回false
    idBtndisabled() {
      if (this.selectedkeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedkeys.length === 3) {
        return this.selectedkeys[this.selectedkeys.length - 1]
      }
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>
<style lang='less' scoped>
.cat_opt {
  margin: 15px 0;
  font-weight: bold;
}
.el-tag {
  margin: 0 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8"
          >
          <el-button type="primary" @click="dialogFormVisible = true"
            >添加用户</el-button
          >

        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialog(scope.row.id)"
            >
            </el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(scope.row)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip placement="top" :enterable="true">
              <div slot="content">分配角色按钮</div>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="getuserInfo(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 7, 9]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
          <!-- 添加用户的对话框 -->
          <el-dialog
            title="添加用户"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal='false'
             width="50%"
             @close="resetForm('adduserRef')"
          >
            <el-form :model="adduser" :rules="adduserrules" ref="adduserRef" >
              <el-form-item
                label="用户名称"
                :label-width="formLabelWidth"
                prop="username"
              >
                <el-input
                  v-model="adduser.username"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="用户密码"
                :label-width="formLabelWidth"
                prop="password"
              >
                <el-input
                  v-model="adduser.password"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="邮箱"
                :label-width="formLabelWidth"
                prop="email"
              >
                <el-input v-model="adduser.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="手机号"
                :label-width="formLabelWidth"
                prop="mobile"
              >
                <el-input
                  v-model="adduser.mobile"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUsers('adduserRef')"
                >确 定</el-button
              >
            </div>
          </el-dialog>
          <!-- 修改用户对话框 -->
          <el-dialog
            title="修改用户信息"
            :visible.sync="editDialogForm"
            :close-on-click-modal='false'
            width="50%"
            @close="resetForm('edituserRef')"
          >
            <el-form :model="edituser" :rules="adduserrules" ref="edituserRef">
              <el-form-item
                label="用户名称"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="edituser.username"
                  autocomplete="off"
                  disabled
                ></el-input>
              </el-form-item>
              </el-form-item>
              <el-form-item
                label="邮箱"
                :label-width="formLabelWidth"
                prop="email"
              >
                <el-input v-model="edituser.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="手机号"
                :label-width="formLabelWidth"
                prop="mobile"
              >
                <el-input
                  v-model="edituser.mobile"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editDialogForm = false">取 消</el-button>
              <el-button type="primary" @click="editUsers()"
                >确 定</el-button
              >
            </div>
          </el-dialog>
              <el-dialog
      title="分配角色"
      :visible.sync="userVisible"
      width="50%"
      @close="resetInfo"
    >
      <div>
        <p>当前的用户: {{ userInfo.username }}</p>
        <p>当前的角色: {{ userInfo.role_name }}</p>
        <p> 分配新角色:
      <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in userRightsList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    let checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
      if (regEmail.test(value)) {
        return callback()
      } else {
        return callback(new Error('您输入的邮箱不正确'))
      }
    }
    // 验证手机号规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        return callback(new Error('您输入的手机号不正确'))
      }
    }
    return {
      value: '',
      userInfo: {},
      userRightsList: [],
      userVisible: false,
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      usersList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      dialogFormVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogForm: false,
      adduser: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      edituser: {},
      formLabelWidth: '100px',
      adduserrules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async saveRoleInfo() {
      if (!this.value) {
        return this.$message.error('请选择要分配的角色')
      }
      const {
        data: res,
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.value,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUsersList()
      this.userVisible = false
    },
    resetInfo() {
      this.value = ''
      this.userRightsList = []
    },
    // 获取角色信息
    async getuserInfo(userInfo) {
      // console.log(userInfo);
      this.userInfo = userInfo
      this.getRightsList()
      this.userVisible = true
    },
    // 获取角色列表
    async getRightsList() {
      const { data: res } = await this.$http('roles')
      if (res.meta.status !== 200) return
      this.userRightsList = res.data
    },
    //重置修改
    resetForm(formName) {
      this.$ref[formName].resetFields()
    },
    // 根据id获取数据
    async editDialog(id) {
      this.editDialogForm = true
      const { data: res } = await this.$http(`users/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) return
      this.edituser = res.data
    },
    // 修改用户信息
    editUsers() {
      this.$refs.edituserRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `users/${this.edituser.id}`,
          {
            email: this.edituser.email,
            mobile: this.edituser.mobile,
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogForm = false
        this.getUsersList()
      })
    },
    //删除用户
    async delUser(item) {
      // 询问用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      // 如果用户确认删除 返回值为字符串confirm
      // 如果用户取消删除 返回值为字符串cancel
      // console.log(confirmResult);
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`users/${item.id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUsersList()
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加用户
    addUsers(formName) {
      // 表单的预校验
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.adduser)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogFormVisible = false
        this.adduser = {}
        this.getUsersList()
      })
    },
    // 获取用户列表
    async getUsersList() {
      const { data: res } = await this.$http('users', {
        params: this.queryInfo,
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 状态修改
    async putStatus() {
      const { data: res } = await this.$http.put('users', {
        params: this.queryInfo,
      })
      // console.log(res)
    },
    // 监听状态按钮
    async changeState(val) {
      // console.log(val)
      const { data: res } = await this.$http.put(
        `users/${val.id}/state/${val.mg_state}`
      )
      // console.log(res);
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 监听pagesize改变的数据
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听newPage改变的数据
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
  },
}
</script>
<style lang='less' scoped>
</style>
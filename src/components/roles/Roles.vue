<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRolesVisible = true"
        >添加角色</el-button
      >
      <el-table :data="rolesList" stripe style="width: 100%" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsId(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag
                ><i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsId(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsId(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="geteditRoles(scope.row.id)"
            >
              编辑
            </el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRoles(scope.row.id)"
            >
              删除
            </el-button>
            <!-- 分配权限 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="roleRightsVisible(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesVisible"
      :close-on-click-modal="false"
      @close="resetRoles('addrolesRef')"
    >
      <el-form :model="addrolesList" :rules="addrolesRules" ref="addrolesRef">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input
            v-model="addrolesList.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input
            v-model="addrolesList.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles('addrolesRef')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesVisible"
      :close-on-click-modal="false"
      @close="resetRoles('editrolesRef')"
    >
      <el-form :model="editrolesList" :rules="addrolesRules" ref="editrolesRef">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input
            v-model="editrolesList.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input
            v-model="editrolesList.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole('editrolesRef')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="rightsVisible"
      width="30%"
      @close="resetArr"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :highlight-current="true"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defkeys"
        :props="rightsProps"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleId: '',
      defkeys: [],
      rolesList: [],
      rightsList: [],
      addrolesList: {
        roleName: '',
        roleDesc: '',
      },
      editrolesList: {},
      addRolesVisible: false,
      editRolesVisible: false,
      rightsVisible: false,
      formLabelWidth: '120px',
      addrolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      rightsProps: {
        children: 'children',
        label: 'authName',
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 点击确定保存 权限状态
    async setRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rightsVisible = false
      this.getRolesList()
    },
    // 清空defkeys数组
    resetArr() {
      this.defkeys = []
    },
    // 获取三级权限的id 递归
    getDefkeys(node, arr) {
      // 如果当前 node节点不包括 children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getDefkeys(item, arr)
      })
    },
    // 分配权限
    async roleRightsVisible(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      // 递归获取三级节点的id
      this.getDefkeys(role, this.defkeys)
      this.rightsVisible = true
    },
    // 根据id删除对应的权限
    async removeRightsId(role, rightsId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightsId}`
      )
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
      // this.getRolesList()
    },
    //   删除角色信息
    async delRoles(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除成功')
      this.getRolesList()
    },
    //   保存编辑后的角色信息
    async editRole(item) {
      this.$refs[item].validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `roles/${this.editrolesList.roleId}`,
          {
            roleName: this.editrolesList.roleName,
            roleDesc: this.editrolesList.roleDesc,
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功')
        this.editRolesVisible = false
        this.getRolesList()
      })
    },
    //   获取编辑后的角色信息
    async geteditRoles(id) {
      const { data: res } = await this.$http('roles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editrolesList = res.data
      this.editRolesVisible = true
    },
    //   编辑角色列表
    editRoles() {},
    //   重置添加角色表单
    resetRoles(item) {
      this.$refs[item].resetFields()
    },
    //   获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http('roles')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 添加角色
    addRoles(item) {
      this.$refs[item].validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addrolesList)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.addrolesList = {}
        this.addRolesVisible = false
      })
    },
  },
}
</script>
<style lang='less' scoped>
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
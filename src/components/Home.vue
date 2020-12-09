<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header
      ><div class="header-left">
        <img src="../assets/eat.png" alt="" />
        <span>吃货后台管理系统</span>
      </div>
      <el-button type="info" @click="signOut">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="ele.id.toString()"
            v-for="ele in menusList"
            :key="ele.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsList[ele.id]"></i>
              <!-- 文本 -->
              <span>{{ ele.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + lis.path"
              v-for="lis in ele.children"
              :key="lis.id"
              @click="saveNavstate('/' + lis.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ lis.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 右侧内容 -->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menusList: [],
      iconsList: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-promotion',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data',
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
    }
  },
  created() {
    this.getMenusList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    signOut() {
      // 清除token
      window.sessionStorage.removeItem('token')
      // 跳转回登录页面
      this.$router.push('/login')
      this.$message('退出成功')
    },
    async getMenusList() {
      // 获取所有的菜单
      const { data: res } = await this.$http('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menusList = res.data
    },
    // 点击按钮 切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavstate(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>
<style lang='less' scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    // padding-left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    .header-left {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 50%;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  cursor: pointer;
  color: #fff;
  letter-spacing: 0.2em;
}
</style>
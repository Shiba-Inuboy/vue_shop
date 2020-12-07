<template>
  <div>
    <el-button type="info" @click="signOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    signOut() {
      // 清除token
      window.sessionStorage.removeItem('token')
      // 跳转回登录页面
      this.$router.push('/login')
      this.$message('退出成功')
    },
  },
}
</script>
<style lang='less' scoped>
</style>
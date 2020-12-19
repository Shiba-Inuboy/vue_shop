<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="400px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope" width="180px">
            {{ scope.row.create_time | dataFormat }}
          </template></el-table-column
        >
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifyAddr"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="logisticsProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改地址"
      :visible.sync="modifyAddrVisible"
      width="50%"
      @close="addrClose('modifyAddrRule')"
    >
      <el-form
        :model="modifyAddrForm"
        :rules="modifyAddrRules"
        ref="modifyAddrRule"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            v-model="modifyAddrForm.address"
            :options="cityData"
            :props="addrProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailed">
          <el-input v-model="modifyAddrForm.detailed"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyAddrVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyAddrVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="物流进度" :visible.sync="logisticsVisible" width="50%">
      <el-timeline :reverse="reverse">
        <!-- <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.content }}
        </el-timeline-item> -->
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4,
      },
      total: 0,
      ordersList: [],
      modifyAddrVisible: false,
      modifyAddrForm: {
        address: [],
        detailed: '',
      },
      addrProps: {
        label: 'label',
        value: 'value',
        children: 'children',
        expandTrigger: 'hover',
      },
      modifyAddrRules: {
        address: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        detailed: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      cityData,
      logisticsVisible: false,
      progressInfo: [],
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res.data)
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrdersList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrdersList()
    },
    modifyAddr() {
      this.modifyAddrVisible = true
    },
    handleChange() {},
    addrClose(refName) {
      this.$refs[refName].resetFields()
    },
    logisticsProgress() {
      //   const { data: res } = await this.$http('/kuaidi/1106975712662')
      //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   this.progressInfo = res.data
      this.logisticsVisible = true
    },
  },
}
</script>
<style lang='less' scoped>
// @import '../../plugins/timeline/timeline.css';
// @import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>
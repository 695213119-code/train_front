<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input v-model="listQuery.userKey" placeholder="手机号/用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-input v-model="listQuery.ipAddress" placeholder="IP地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="listQuery.platform" placeholder="登录平台" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item==1?'PC':item==2?'APP':'小程序'" :value="item" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

     <el-table-column label="手机号"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName==""?"未实名制的用户":scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="登录Ip地址"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ipAddress }}</span>
        </template>
      </el-table-column>

      <el-table-column label="登录平台"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.platform==1?"PC端":scope.row.platform==2?"APP端":"小程序端" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="登录时间"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime }}</span>
        </template>
      </el-table-column>
    
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination' 

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Loginlog',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list:null,
      total: 0,
      listLoading: true,
      //搜索条件
      listQuery: {
        page: 1,
        limit: 10,
        timeStart:undefined,
        timeEnd:undefined,
        platform:undefined,
        userKey:undefined,
        ipAddress:undefined
      },
      //登录类型选择
      importanceOptions: [1,2,3],
      calendarTypeOptions,
      showReviewer: false,
      //返回结果
     temp: {
        id: undefined,
        userName:"",
        phone:"",
        platform:"",
        ipAddress:"",
        loginTime:""
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        //不知道作用,但是删除后页面会一直转圈圈
        setTimeout(() => {
          this.listLoading = false
        }, 0 * 1)
      })
    },
    //条件搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

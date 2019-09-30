<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input v-model="listQuery.key" placeholder="KEY"  style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-input v-model="listQuery.remarks" placeholder="备注" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

     <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加新的字典
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


      <el-table-column label="字典的key" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dicKey }}</span>
        </template>
      </el-table-column>

      <el-table-column label="字典的val"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dicValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            操作字典
          </el-button>

        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


    <!-- 添加/修改字典  :rules="rules"-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
      
      <!-- 编辑状态下属性为只读  -->
        <el-form-item label="KEY" prop="dicKey" >
          <el-input v-model="temp.dicKey"  :disabled="readonly"/>
        </el-form-item>
    
        <el-form-item label="Val" prop="dicValue">
          <el-input v-model="temp.dicValue" />
        </el-form-item>

         <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { queryDictionaries,createArticle,updateArticle } from '@/api/dictionary'
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
  name: 'DataDictionary',
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
        key:undefined,
        remarks:undefined
      },
      calendarTypeOptions,
      showReviewer: false,
      //返回结果
      temp: {
        id: undefined,
        dicKey:"",
        dicValue:"",
        remarks:"",
        createTime:"",
        updateTime:""
       },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '操作字典',
        create: '添加新的字典'
      },
      dialogPvVisible: false,
      pvData: [],
      //prop="remarks" 必须跟rules的对象名一致
      rules: {
       dicKey: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
       dicValue: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
       remarks: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
      },
      downloadLoading: false,
      //设置只读属性
      readonly:true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      queryDictionaries(this.listQuery).then(response => {
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
    },
    //临时数据存储
     resetTemp() {
      this.temp = {
        id: undefined,
        dicKey:"",
        dicValue:"",
        remarks:"",
        createTime:"",
        updateTime:""
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.readonly=false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) 
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.readonly=true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //添加字典
     createData() {
       console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加新字典成功',
              type: 'success',
              duration: 2000
            })
            //得刷新列表
             this.getList()
          })
        }
      })
    },
    //修改字典
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新字典成功',
              type: 'success',
              duration: 2000
            })
            //得刷新列表
            this.getList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
input[disabled],input:disabled,input.disabled{  
    color: #333;  
    -webkit-text-fill-color:#333;  
    -webkit-opacity:1;  
    opacity: 1;  
} 
</style>
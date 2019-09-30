<template>
  <div class="app-container">
    <div class="filter-container">
        
      <el-input clearable v-model="listQuery.comprehensive" placeholder="手机号/用户名/身份证号码"  style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="listQuery.roleId" clearable placeholder="角色" style="width: 100px;">
          <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
          </el-option>
      </el-select>

    <el-select v-model="listQuery.isReal" clearable placeholder="是否实名制" style="width: 130px;">
        <el-option
          v-for="item in isRealNamePv"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
    </el-select>

    <span class="demonstration"></span>
    <el-date-picker
      v-model="userCreateTime"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>


      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

     <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加管理员
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
          <span>{{ scope.row.userCore.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userCore.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实名信息" align="center">
        <template slot-scope="scope">
             <el-link type="primary" @click="handleFetchPv(scope.row.userCore)">
                 点击查看用户实名信息
                 <i class="el-icon-view el-icon--right"></i>
            </el-link>
        </template>
      </el-table-column>

      <el-table-column label="附属信息"  align="center">
        <template slot-scope="scope">
             <el-link type="primary" @click="handleUserSubsidiaryPv(scope.row.userSubsidiary)">
                 点击查看用户附属信息
                 <i class="el-icon-view el-icon--right"></i>
            </el-link>         
        </template>
      </el-table-column>

      <el-table-column label="第三方信息" align="center">
        <template slot-scope="scope">
             <el-link type="primary" @click="handleUserThirdsPv(scope.row.userThirds)">
                 点击查看用户第三方信息
                 <i class="el-icon-view el-icon--right"></i>
            </el-link>          
        </template>
      </el-table-column>

      <el-table-column label="临时权限" align="center">
        <template slot-scope="scope">
             <el-link type="primary">
                 待实现
                 <i class="el-icon-view el-icon--right"></i>
            </el-link>          
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
        <el-link><i class="el-icon-refresh-right" @click="resetPasswordButton(row.id)"></i></el-link>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


    <!-- 添加管理员-->
    <el-dialog title="添加管理员" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="addAdministratorsDTO" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
      
        <el-form-item label="用户名" prop="phone" >
          <el-input v-model="addAdministratorsDTO.phone" />
        </el-form-item>
    
        <el-form-item label="密码" prop="password">
          <el-input v-model="addAdministratorsDTO.password" />
        </el-form-item>

        <el-form-item label="角色"  prop="roleId">
        <el-select v-model="addAdministratorsDTO.roleId" clearable placeholder="请选择角色" style="width: 330px;"  >
            <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
            </el-option>
        </el-select>            
        </el-form-item>
      

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          我再想想
        </el-button>
        <el-button type="primary" @click="createData()">
          添加
        </el-button>
      </div>
    </el-dialog>

    <!-- 数据展示弹框 -->
    <el-dialog :visible.sync="dialogPvVisible" :title="userTitle">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="展示项" />
        <el-table-column prop="pv" label="展示值" />
      </el-table>
    </el-dialog>


    <!-- 用户第三方信息展示弹框 -->
    <el-dialog :visible.sync="thirdDialogPvVisible" :title="userTitle">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="展示项" />
        <el-table-column prop="pv" label="展示值" />
      </el-table>
      <el-button-group>
         <el-button :style="{ display: pvListIndexes>0?'':'none' }" @click="thirdPartyLastArticle" type="primary" icon="el-icon-arrow-left">上一条</el-button>
        <el-button :style="{ display: indexnumber>1?'':'none' }" :disabled="(pvListIndexes+2)>indexnumber?true:false" @click="thirdPartyNextArticle" type="primary">下一条<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>      
    </el-dialog>


  </div>
</template>

<script>
import Pagination from '@/components/Pagination' 
import{queryUserTabulation,addAdministrators,resetPassword} from '@/api/usermanagement'
import { queryRoleAll} from '@/api/role'
import waves from '@/directive/waves' 
import {parseTime} from '@/utils' 

//不能删除,会报错
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
  name: 'UserManagement',
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
    total: 0,
    list:null,
    listLoading: true,
    dialogPvVisible: false,
    indexnumber:undefined,
    pvListIndexes:undefined,
    thirdDialogPvVisible:false,
    pvListTem:[],
    userTitle:"",
    pvData: [],
    options: [],    
    userCreateTime: '', 
    calendarTypeOptions,
    dialogFormVisible: false,
    dialogStatus: '',
    downloadLoading: false, 
    //身份信息
    realnamePvData:[
    { "key":"用户名",'pv': ""},
    { "key":"身份证号码",'pv': ""},
    { "key":"身份证证件",'pv': ""}
    ],
    //用户附属数据
    userSubsidiaryPv:[
       { "key":"用户昵称",'pv': ""},
       { "key":"用户头像",'pv': ""},
       { "key":"用户性别",'pv': ""},
       { "key":"用户年龄",'pv': ""},
       { "key":"用户生日(农历)",'pv': ""},
       { "key":"用户生日(公历)",'pv': ""}
     ],
    //用户第三方信息
    userThirdsPv:[
       { "key":"平台类型",'pv': ""},
       { "key":"用户标识",'pv': ""},
       { "key":"用户昵称",'pv': ""},
       { "key":"用户性别",'pv': ""},
       { "key":"用户age",'pv': ""},
       { "key":"用户头像",'pv': ""}
    ],
    //实名选择框
    isRealNamePv:[
      {value:1,label:"是"},
      {value:2,label:"否"},
    ],
    //时间选项框
    pickerOptions: {
      shortcuts: [{
        text: '最近一周',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        }
      }, {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', [start, end]);
        }
      }, {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', [start, end]);
        }
      }]
    },
    //搜索条件
    listQuery: {
    page: 1,
    limit: 10,
    comprehensive:undefined,
    roleId:undefined,
    isReal:undefined,
    crateStartTime:undefined,
    crateEndTime:undefined
    },
    //添加管理员DTO
    addAdministratorsDTO:{
      phone:undefined,
      password:undefined,
      roleId:undefined
    },
    //校验
    rules: {
      phone: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
      password: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
      roleId: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
     }
    }
  },

  created() {
    this.getList(),
    this.queryRoleList()
  },

  methods: {

    //获取用户列表 
    getList() {
       //判断是否存在创建时间查询
       if(this.userCreateTime!=''&& this.userCreateTime.length>0){
         this.listQuery.crateStartTime=parseTime(this.userCreateTime[0],'{y}-{m}-{d}');
         this.listQuery.crateEndTime=parseTime(this.userCreateTime[1],'{y}-{m}-{d}');
       } 
      this.listLoading = true
      queryUserTabulation(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
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

    //实名数据弹框展示
    handleFetchPv(pv) {    
    if(pv.idCard==null){
        this.$alert('该用户没有实名认证', '用户实名信息', {
          confirmButtonText: '知道了'
        });
    }else{
    this.realnamePvData[0].pv=pv.userName;
    this.realnamePvData[1].pv=pv.idCard;
    this.realnamePvData[2].pv=pv.cardUrl;
    this.pvData = this.realnamePvData
    this.userTitle="用户实名信息";
    this.dialogPvVisible = true
      }
    },

    //附属数据弹框展示
    handleUserSubsidiaryPv(pv){
    this.userSubsidiaryPv[0].pv=pv.nickName;
    this.userSubsidiaryPv[1].pv=pv.avatar;
    this.userSubsidiaryPv[2].pv=pv.gender==1?"靓仔":"靓女";
    this.userSubsidiaryPv[3].pv=pv.age;
    this.userSubsidiaryPv[4].pv=pv.birthdayLunar;
    this.userSubsidiaryPv[5].pv=pv.birthdayGregorian;
    this.pvData = this.userSubsidiaryPv
    this.userTitle="用户附属信息";
    this.dialogPvVisible = true
    },

    //第三方信息弹框展示
    handleUserThirdsPv(pvList){
    //判断是否存在数据
    if(pvList.length==0){
        this.$alert('该用户没有第三方信息', '用户第三方信息', {
          confirmButtonText: '知道了'
        });
    } else{
    //获取当前数据的长度
    this.indexnumber=pvList.length;
    //获取数组当前索引
    this.pvListIndexes=0;
    this.elasticFrameUserThirdsPv(pvList);
    this.pvListTem=pvList;
      }
    },

    //用户第三方信息弹框
    elasticFrameUserThirdsPv(pvList){
    let index=this.pvListIndexes;  
    this.userThirdsPv[0].pv= pvList[index].platform==1?"QQ":"微信";
    this.userThirdsPv[1].pv= pvList[index].unionId;
    this.userThirdsPv[2].pv= pvList[index].nickName;
    this.userThirdsPv[3].pv= pvList[index].gender==0?"未知":pvList[index].gender==1?"靓仔":"靓女";
    this.userThirdsPv[4].pv= pvList[index].age;
    this.userThirdsPv[5].pv= pvList[index].avatar;
    this.pvData = this.userThirdsPv
    this.userTitle="用户第三方信息";
    this.thirdDialogPvVisible = true
    },

    //下一条按钮
    thirdPartyNextArticle(){
        this.pvListIndexes=this.pvListIndexes+1;
        this.elasticFrameUserThirdsPv(this.pvListTem);
        
    },

    //上一条按钮
    thirdPartyLastArticle(){
    this.pvListIndexes=this.pvListIndexes-1;
    this.elasticFrameUserThirdsPv(this.pvListTem);
    },

    //获取所有角色
    queryRoleList(){
        queryRoleAll().then(response => {
        this.options = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0 * 1)
      })
    },

    //添加管理员按钮触发事件
    handleCreate() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    //添加管理员api
     createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAdministrators(this.addAdministratorsDTO).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加管理员成功',
              type: 'success',
              duration: 2000
            })
            //得刷新列表
             this.getList()
          })
        }
      })
    },
    //重置密码弹框
    resetPasswordButton(userId){
      this.$confirm('此操作将重置该用户的密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '我再想想',
        type: 'warning'
      }).then(() => {
        resetPassword(userId).then(() => {
        this.$message({
          type: 'success',
          message: '重置密码成功!'
        });          
         })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        });          
      });
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
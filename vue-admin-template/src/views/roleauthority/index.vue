<template>
  <div class="app-container">

    <el-button type="primary" @click="handleAddRole">新建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>

      <el-table-column align="center" label="角色名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色职责" width="320">
        <template slot-scope="scope">
          {{ scope.row.roleDuty }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="创建时间" width="220">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="更新时间" width="220">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>


      <el-table-column align="header-center" label="角色权限" width="220">
        <template slot-scope="scope">
         <el-link type="primary" @click="queryRolePermissions(scope.row.roleAuthority,scope.row.selectPermissions)">点击查看权限<i class="el-icon-view el-icon--right"></i> </el-link>
        </template>
        
      </el-table-column>

      <el-table-column align="center" label="操作" width="490">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="info " size="small"   @click="empowerment(scope.row.id,scope.row.roleAuthority,scope.row.selectPermissions)">赋权</el-button>
        </template>  
      </el-table-column> 
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRoles" />


    <!-- 添加/修改角色弹框组件 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form  :rules="rules" :model="role" label-width="80px" label-position="left">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色职责" prop="roleDuty">
          <el-input
            v-model="role.roleDuty"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入角色职责"
          />
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>


    <!-- 角色赋权弹框组件 树形菜单-->
    <el-dialog :visible.sync="roleEmpowerment">
        <el-form  label-width="80px" label-position="left">
            <el-form-item :label="roleExhibitionName">
                <el-tree
                :data="routesData"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                :props="defaultProps">
                </el-tree>
            </el-form-item>
        </el-form>

        <el-button type="primary" round :style="{ display: visibleCancel }" @click="saveAuthority">点击保存</el-button>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoleList, addRole, deleteRole, updateRole ,roleUthorization} from '@/api/role'
import Pagination from '@/components/Pagination' 


// 定义数据
const defaultRole = {
  id:'',
  roleName: '',
  roleDuty: '',
  createTime: '',
  updateTime: '',
  roleAuthority: [],
  selectPermissions:[]
}

export default {
  name:"RoleAuthority",
  components: { Pagination },
  data() {
    return {

    //权限tree框的名称
    roleExhibitionName:"",
    //角色赋权弹框
    roleEmpowerment:false,
    //保存权限按钮
    visibleCancel:"none",
    //角色赋权框是否禁用
    checkStrictly: true,


    //菜单权限数据
    routesData:[],
    //权限tree菜单中被选中的权限id数组
    menuKeys:[],
    //tree菜单
    defaultProps: {
      children: 'roleAuthorityChildren',
      label: 'jurName',
      disabled: this.disabledFn
    },  

    rules: {
      roleName: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
      roleDuty: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
    },


    //角色赋权DTO
    addRoleAuthorityDTO:{
      roleId:undefined,
      roleAuthority:[]
    },

     isUnderline:true,

     total: 0,
    //列表搜索条件数据
      listQuery: {
        page: 1,
        limit: 10,
        roleName:undefined
      },
      //定义添加/修改数据模型
      role: {
        id:undefined,
        roleName: '',
        roleDuty: ''
      },
      routes: [],
      //返回集合中的数据
      rolesList: [],
      //添加/修改角色弹框
      dialogVisible: false,
      dialogType: 'new'
    }
  },

  created() {
    this.getRoles()
  },

  methods: {  
    //点击查看权限弹框 数据 选中的权限id数组
    queryRolePermissions(data,selectPermissions){
      this.routesData=[];
      this.roleExhibitionName="角色权限";
      this.roleEmpowerment=true;
      this.$nextTick(function() {
          if(selectPermissions==null){
              this.$refs.tree.setCheckedKeys([])
          }else{
              this.$refs.tree.setCheckedKeys(selectPermissions);
          }
      })
      this.visibleCancel='none';
      this.routesData=data;
      this.checkStrictly=true;
    },

    //角色赋权弹框 角色id tree菜单数据 选中数据
    empowerment(roleId,roleAuthority,selectPermissions){
      this.routesData=[]; 
      this.roleExhibitionName="角色赋权";   
      this.roleEmpowerment=true;
      this.$nextTick(function() {
          if(selectPermissions==null){
              this.$refs.tree.setCheckedKeys([])
          }else{
              this.$refs.tree.setCheckedKeys(selectPermissions)
          }
      })   
      this.visibleCancel='';
      this.routesData=roleAuthority;      
      this.checkStrictly=false;
      this.addRoleAuthorityDTO.roleId=roleId;
    },

    //保存权限
    saveAuthority(){
     this.addRoleAuthorityDTO.roleAuthority=this.$refs.tree.getCheckedKeys();
     roleUthorization(this.addRoleAuthorityDTO).then(() => {
        this.roleEmpowerment=false;
        this.$notify({
          title: 'Success',
          message: '角色赋权成功',
          type: 'success',
          duration: 2000
        })
      this.getRoles()
      })
    },

    //获取角色列表
    getRoles() {
        getRoleList(this.listQuery).then(response => {
        this.rolesList = response.data
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 0 * 1)
      })
    },

    //角色搜索
    search(){
      this.getRoles();
    },

    //设置角色赋权是选择框禁用
    disabledFn(data, node) {
         return this.checkStrictly;
    },

    //新建角色弹框属性设置
    handleAddRole() {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.role.roleName=''
      this.role.roleDuty=''
    },
    //修改角色弹框属性设置
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
    },
    //删除角色
    handleDelete({ $index, row }) {
      this.$confirm('您确定删除该角色?', '警告', {
        confirmButtonText: '我很确定',
        cancelButtonText: '我再想想',
        type: 'warning'
      })
        .then(async() => {
            //执行删除角色方法
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除角色成功!'
          })

        })
        .catch(err => { console.error(err) })
    },
    //提交角色表单
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      //判断新增还是修改
      if (isEdit) {
          //执行修改角色方法
        await updateRole(this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
          //执行添加角色方法
       await addRole(this.role)
      }
      //回显提示信息
      const { roleName, roleDuty } = this.role
      this.dialogVisible = false
      this.$notify({
        title: this.dialogType === 'edit'? "编辑角色成功":"新增角色成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色名称: ${roleName}</div>
            <div>角色职责: ${roleDuty}</div> `,
        type: 'success'
      })
     this.getRoles();
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>

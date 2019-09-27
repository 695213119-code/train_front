<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>

      <el-table-column align="center" label="角色名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色职责" width="220">
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
        <el-link @click="queryRolePermissions(scope.row.roleAuthority,scope.row.selectPermissions)">
            点击查看权限
        <i class="el-icon-view el-icon--right"></i> </el-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="info " size="small"  >赋权</el-button>
          <!-- @click="empowerment"  -->
        </template>  
      </el-table-column> 
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRoles" />


    <!-- 添加/修改角色弹框组件 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">

        <el-form-item label="角色名称">
          <el-input v-model="role.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色职责">
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
            <el-form-item label="角色权限">
                <el-tree
                :data="routesData"
                show-checkbox
                highlight-current
                default-expand-all
                node-key="id"
                :props="defaultProps"
                :default-checked-keys="menuKeys">
                </el-tree>
            </el-form-item>
        </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
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
      //角色赋权弹框
      roleEmpowerment:false,
      dialogType: 'new',
      //角色赋权框是否禁用
      checkStrictly: true,
      //菜单权限数据
      routesData:[],
      menuKeys:[],
      //多级菜单
      defaultProps: {
        children: 'roleAuthorityChildren',
        label: 'jurName',
        disabled: this.disabledFn
      }
    }
  },
  created() {
    this.getRoles()
  },
  methods: {

      
    //获取角色列表
    async getRoles() {
      const res = await getRoles(this.listQuery)
      this.rolesList = res.data
      this.total = res.total
    },
    //点击查询角色权限
    queryRolePermissions(data,selectPermissions){
        this.roleEmpowerment=true;
        this.routesData=data;
        //获取当前角色权限被选中的权限id
        console.log(selectPermissions);
        this.menuKeys=selectPermissions;
        
    },
    //设置角色赋权是选择框禁用
    disabledFn(data, node) {
         return this.checkStrictly;
    },
    //新建角色弹框属性设置
    handleAddRole() {
      this.dialogType = 'new'
      this.dialogVisible = true
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
          await deleteRole(row.key)
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
        //获取当前弹框状态
      const isEdit = this.dialogType === 'edit'
    //判断新增还是修改
      if (isEdit) {
          //执行修改角色方法
        await updateRole(this.role.key, this.role)
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
        title: '操作成功',
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色名称: ${roleName}</div>
            <div>角色职责: ${roleDuty}</div> `,
        type: 'success'

      })
      //重新刷新页面
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

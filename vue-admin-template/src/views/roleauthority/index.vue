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
        <span  class="link-type" @click="queryRolePermissions(scope.row.roleAuthority)">点击查看角色权限</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="info " size="small" >赋权</el-button>
          <!-- @click="handleDelete(scope)" -->
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
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
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
  roleAuthority: []
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
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
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
    queryRolePermissions(){
        this.roleEmpowerment=true;
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
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
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })

        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    //提交角色表单
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
    //   const checkedKeys = this.$refs.tree.getCheckedKeys()
    //   this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
    //判断新增还是修改
      if (isEdit) {
        await updateRole(this.role.key, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
       await addRole(this.role)
      }
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
     this.getRoles();
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
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

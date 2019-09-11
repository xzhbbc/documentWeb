<template>
    <div class="serverIndex">
      <el-container>
        <el-aside class="sideBar" width="200px;">
          <!-- @open="handleOpen"
            @close="handleClose" :collapse="true"-->
          <div class="sideOpen" @click="goFold">
            <i :class="[{'el-icon-s-fold':!collapse}, {'el-icon-s-unfold':collapse}]"  class="icon"></i>
          </div>
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :router="true"
            :default-openeds="['1','2' , '3']"
            :collapse="collapse"
          >
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-user"></i></template>
              <template slot="title">
                <span>基本信息</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/server">查看</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="/fixCode">密码修改</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu v-if="user.power < 2" index="2">
              <template slot="title"><i class="el-icon-menu"></i></template>
              <template slot="title">
                <span>部门管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/departmentInput">部门录入</el-menu-item>
                <el-menu-item
                  index="/departmentEditor"
                  v-if="user.admin"
                >部门修改/删除</el-menu-item>
                <el-menu-item index="/member">成员管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-document"></i></template>
              <template slot="title">
                <span>内容管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="/markdownSend"
                >markDown发布</el-menu-item>
                <el-menu-item
                  index="/quillSend"
                >富文本发布</el-menu-item>
                <el-menu-item
                  index="/wordSend"
                >文本文件发布</el-menu-item>
                <el-menu-item index="/contentSee">查看</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <router-view/>
        </el-container>
      </el-container>
    </div>
</template>

<script>
    export default {
        name: "Server",
        data() {
            return {
                collapse: false
            }
        },
        created() {
            this.$store.commit('getDepartment')
            this.$store.commit('getLogin')
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
        },
        methods: {
            goFold() {
                this.collapse = !this.collapse
            }
        }
    }
</script>

<style lang="less" scoped>
.serverIndex {
  margin-bottom: 50px;
  .sideOpen {
    text-align: center;
    cursor: pointer;
    .icon {
      font-size: 24px;
    }
  }
}
</style>

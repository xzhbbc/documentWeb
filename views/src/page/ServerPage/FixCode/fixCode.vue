<template>
  <div class="fixCode">
    <div class="login">
      旧密码：
      <el-input
        placeholder="请输入旧密码"
        v-model="oldpwd"
        show-password
        clearable
        class="input"
      >
      </el-input>
    </div>
    <div class="login">
      密码：
      <el-input
        placeholder="请输入新密码"
        v-model="pwd"
        show-password
        clearable
        class="input"
      >
      </el-input>
    </div>
    <div
      class="login"
    >
      确认密码：
      <el-input
        placeholder="请再次输入新密码"
        v-model="pwd1"
        show-password
        clearable
        class="input"
      >
      </el-input>
    </div>
    <div
      class="btn"
    >
      <el-button
        type="primary"
        style="float: right"
        @click="onSubmit"
      >确认</el-button>
    </div>
  </div>
</template>

<script>
    import * as api from '../../../util/api'
    export default {
        data() {
            return {
                pwd: '',
                pwd1: '',
                oldpwd: '',
            }
        },

        methods: {
            async onSubmit() {
                if (this.pwd != this.pwd1) {
                    return this.$message({
                        type: 'warning',
                        message: '两次输入密码不一致'
                    })
                }
                if (this.oldpwd == '') {
                    return this.$message({
                        type: 'warning',
                        message: '请输入旧密码'
                    })
                }
                if (this.pwd == '') {
                    return this.$message({
                        type: 'warning',
                        message: '请输入密码'
                    })
                }
                let user = JSON.parse(window.localStorage.getItem('user')).user
                let data = await api.post('/user/fixCode', {
                    user,
                    pwd: this.pwd,
                    old: this.oldpwd
                })

                if (data == 1) {
                    //修改成功
                    this.$message.success('修改成功，需要重新登录！')
                    this.$store.commit('setLogin', false)
                    this.$router.push('/')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  .fixCode {
    width: 80%;
    margin: 0 auto;
    .login {
      width: 80%;
      margin: 10px auto;
      .input {
        margin-top: 10px;
      }
    }
    .btn {
      width: 80%;
      margin: 20px auto;
    }
  }
</style>

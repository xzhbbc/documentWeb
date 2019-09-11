<template>
    <div class="wrap">
      <div class="inputBox">
        <div class="text">账号：</div>
        <el-input class="input" v-model="user" placeholder="请输入用户名"></el-input>
      </div>
      <div class="inputBox">
        <div class="text">密码：</div>
        <el-input class="input" v-model="pwd" type="password" placeholder="请输入密码"></el-input>
      </div>
      <div v-show="!loginShow" class="inputBox">
        <div class="text">请再次确认您的密码：</div>
        <el-input class="input" v-model="checkpwd" type="password" placeholder="请输入密码"></el-input>
      </div>
      <div v-show="!loginShow" class="inputBox">
        <div class="text">邮箱：</div>
        <el-input class="input" v-model="email" placeholder="请输入邮箱"></el-input>
      </div>
      <div v-show="!loginShow" class="inputBox">
        <div class="text">手机：</div>
        <el-input class="input" v-model="tel"  placeholder="请输入手机"></el-input>
      </div>
      <div v-show="!loginShow" class="inputBox">
        <div class="text">所属部门：</div>
        <el-select @change="changeSel" class="inputSel" v-model="department" placeholder="请选择">
          <el-option
            v-for="item in getOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="btnWrap">
        <el-button class="btn" type="primary" v-show="loginShow" @click="login">登录</el-button>
        <el-button class="btn" v-show="loginShow" @click="registerShow">注册</el-button>

        <el-button class="btn" v-show="!loginShow" type="primary" @click="register">注册</el-button>
        <el-button class="btn" v-show="!loginShow" @click="loginShowBtn">登录</el-button>
      </div>
    </div>
</template>

<script>
    import * as api from '../../../util/api'
    export default {
        name: "Login",
        data() {
            return {
                user: '',
                pwd: '',
                checkpwd: '',
                options: [{
                    value: '选项一',
                    label: '研发部'
                }],
                department: '',
                loginShow: true,
                email: '',
                tel: ''
            }
        },
        created() {
            this.$store.commit('getDepartment')
        },
        computed: {
            getOption() {
                let data = this.$store.getters.getDepartment
                data = data.map(res => {
                    res.value = res._id
                    res.label = res.name
                    return res
                })
                return data
            }
        },
        methods: {
            async login() {
              if (this.user == '') {
                  return this.$message.info('请填写用户名')
              }
              if (this.pwd == '') {
                  return this.$message.info('请填写密码')
              }

              let getUser = await api.post('/user/loginUser', {
                  user: this.user,
                  pwd: this.pwd
              })
                if (getUser._id) {
                    this.$store.commit('setLogin', getUser)
                    this.$message.success('登录成功！')
                    this.$router.push('/')
                }
            },
            async register() {
              if (this.user == '') {
                  return this.$message.info('请填写用户名')
              }
              if (this.pwd == '') {
                  return this.$message.info('请填写密码')
              }
              if (this.department == ''||this.department == void 0) {
                  return this.$message.info('请选择一个部门')
              }
              if (this.pwd != this.checkpwd) {
                  return this.$message.info('两次输入的密码不一致')
              }
              let saveUser = await api.post('/user/registerUser', {
                  user: this.user,
                  pwd: this.pwd,
                  department: this.department,
                  email: this.email,
                  tel: this.tel,
              })
                if (saveUser._id) {
                    this.$store.commit('setLogin', saveUser)
                    this.$message.success('注册成功！')
                    this.$router.push('/')
                }
            },
            registerShow() {
                this.loginShow = false
            },
            loginShowBtn() {
                this.loginShow = true
            },
            changeSel(val) {
                console.log(val)
                this.department = val
            }
        }
    }
</script>

<style lang="less" scoped>
.wrap {
  width: 40%;
  height: 650px;
  margin: 0 auto;
  .inputBox {
    width: 100%;
    height: 90px;
    line-height: 45px;
  }
  .btnWrap {
    width: 100%;
    height: 35px;
    .btn {
      float: right;
      margin-top: 30px;
      margin-left: 20px;
    }
  }
}
</style>

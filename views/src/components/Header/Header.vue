<template>
    <div class="header">
      <div class="megBox">
        <p>Document</p>
        <p>Web</p>
      </div>
      <div class="nav">
        <div class="item" :class="{'active': routeId == ''}" @click="goPath('/')">
            首页
        </div>
        <div
          v-for="item in getOption"
          :key="item._id"
          class="item"
          @click="setPath(item._id)"
          :class="{'active': item._id == routeId}"
        >{{item.name}}</div>
        <div class="right_itemList">
          <div class="right_item" v-show="login" @click="goOut">退出</div>
          <div class="right_item" v-show="login" @click="goPath('/server')">欢迎你，{{user.user}}</div>
          <div class="right_item" v-show="!login" @click="goPath('/login')">登录</div>
          <div class="right_icon" @click="openSearch">
            <div class="icon el-icon-search"></div>
          </div>
        </div>
      </div>

      <el-dialog title="搜索" :visible.sync="dialogTableVisible">
        <div class="dialog">
          <div class="input_box">
            <div class="text">關鍵詞：</div>
            <el-input @keyup.enter.native="goSearch" class="input" v-model="search"/>
          </div>
          <el-button class="btnBig" type="primary" @click="goSearch">查找</el-button>
          <div class="list">
            <div v-for="item in searchList" :key="item._id" @click="goDetail(item._id)" class="list_item">
              <div class="title">{{item.title}}</div>
              <div class="time">{{renderTime(item.create_time)}}</div>
              <div class="content" v-html="item.htmlContent"></div>
            </div>
          </div>
        </div>
      </el-dialog>

    </div>
</template>

<script>
  import * as api from '../../util/api'
  import moment from 'moment'
    export default {
        name: "Header",
        data() {
            return {
                dialogTableVisible: false,
                search: '',
                searchList: []
            }
        },
        methods: {
            goPath(path) {
                this.$router.push(path)
                this.setPath('')
            },
            async goOut() {
              this.$store.commit('setLogin', false)
              await api.get('user/logout')
              this.$router.push('/')
            },
            setPath(id) {
                if (id != '') {
                    this.$router.push('/?id=' + id)
                }
                this.$store.commit('setRouterId', id)
            },
            openSearch() {
                this.dialogTableVisible = true
            },
            async goSearch() {
              let searchData = await api.post('/front/findContent', {
                  search: this.search
              })
              this.searchList = searchData
            },
            renderTime(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
            goDetail(id) {
                this.dialogTableVisible = false
                this.$router.push('/megContent?id='+id)
            }
        },
        created() {
            this.$store.commit('getDepartment')
            this.$store.commit('getLogin')
        },
        computed: {
            getOption() {
                let data = this.$store.getters.getDepartment
                return data
            },
            user() {
                return this.$store.getters.user
            },
            login() {
                return this.$store.getters.login
            },
            routeId() {
                return this.$store.getters.routeId
            },
        },
    }
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 300px;
  position: relative;
  .dialog {
    .input_box .input {
      margin: 10px 0;
    }
    .btnBig {
      width: 100%;
    }
    .list {
      width: 100%;
      padding: 10px 0;
      .list_item {
        width: 100%;
        height: 80px;
        border-bottom: 1px solid #999;
        margin-top: 20px;
        cursor: pointer;
        .title {
          font-size: 18px;
          font-weight: bold;
        }
        .time {
          margin: 5px 0;
          color: #a5a5a5;
        }
        .content {
          width: 100%;
          height: 30px;
          overflow:hidden;/*超出隐藏*/
          text-overflow:ellipsis;/*文本溢出时显示省略标记*/
          display:-webkit-box;/*设置弹性盒模型*/
          -webkit-line-clamp:2;/*文本占的行数,如果要设置2行加...则设置为2*/
          -webkit-box-orient:vertical;/*子代元素垂直显示*/
        }
      }
    }
  }
  .megBox {
    width: 150px;
    height: 80px;
    border: 3px solid #000;
    border-radius: 5px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -40px;
    margin-left: -75px;
    font-size: 24px;
    font-weight: bold;
    line-height: 40px;
  }
  .nav {
    width: 80%;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    .item {
      padding: 5px 5px;
      float: left;
      margin-right: 10px;
      position: relative;
      cursor: pointer;
      position: relative;
    }
    .item:hover {
      color: #4695c8;
     border-bottom: 1px solid #4695c8;
    }
    .active {
      color: #4695c8;
      border-bottom: 1px solid #4695c8;
    }
    .right_itemList {
      float: right;
      width: auto;
      height: 30px;
      line-height: 30px;
      .right_item {
        float: right;
        cursor: pointer;
        margin-left: 20px;
      }
      .right_icon {
        float: right;
        cursor: pointer;
        margin-left: 20px;
      }
      .right_icon:hover {
        transform: scale(1.2);
        transition: .2s ease all;
      }
      .right_item:hover {
        color: #4695c8;
        border-bottom: 1px solid #4695c8;
      }
    }
  }
}
</style>

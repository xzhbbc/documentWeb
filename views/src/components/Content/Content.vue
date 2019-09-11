<template>
    <div class="warp wow fadeInUp" data-wow-duration=".5s" data-wow-delay=".2s">
      <div class="title" @click="goPath(data)">{{data.title}}</div>
      <div class="sub">
        <span class="time">{{renderTime(data.create_time)}}</span>
        <span class="iconfont icon-biaoji"></span>
        <span class="text">{{data.create_user.user}} | {{data.tags}}</span>
      </div>
      <div class="detail" v-html="data.htmlContent">
      </div>
      <div class="btnWrap">
        <div class="btn" @click="goPath(data)" @mouseover="goRead" @mouseout="outRead">
          <span class="read" >Read More</span>
          <transition name="fade">
            <span class="read go" v-show="go"> > </span>
          </transition>
        </div>
      </div>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "Content",
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        title: '',
                        htmlContent: '',
                        tags: '',
                        create_time: ''
                    }
                }
            }
        },
        data() {
            return {
                go: false
            }
        },
        methods: {
            goRead() {
                this.go = true
            },
            outRead() {
                this.go = false
            },
            goPath(item) {
                this.$emit('go', item._id)
            },
            renderTime(date) {
                return moment(date).format('YYYY-MM-DD HH:mm')
            },
        }
    }
</script>

<style lang="less" scoped>
@keyframes mymove
{
  from {
    transform: translateX(-15px);
    opacity: 0;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
}
@keyframes myback
{
  from {
    transform: translateX(0px);
    opacity: 1;
  }
  to {
    transform: translateX(-15px);
    opacity: 0;
  }
}
.warp {
  width: 80%;
  height: 235px;
  background: #fff;
  margin: 0 auto 50px auto;
  .title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    text-align: center;
    font-weight: bold;
    padding: 30px 0 10px 0;
    cursor: pointer;
  }
  .title:hover {
    transform: scale(1.2);
    transition: .2s ease all;
  }
  .sub {
    width: 50%;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    color: #a5a5a5;
    text-align: center;
  }
  .detail {
    width: 80%;
    height: 57px;
    margin: 10px auto;
    line-height: 20px;
    overflow:hidden;/*超出隐藏*/
    text-overflow:ellipsis;/*文本溢出时显示省略标记*/
    display:-webkit-box;/*设置弹性盒模型*/
    -webkit-line-clamp:3;/*文本占的行数,如果要设置2行加...则设置为2*/
    -webkit-box-orient:vertical;/*子代元素垂直显示*/
  }

  .btnWrap {
    width: 80%;
    height: 30px;
    margin: 10px auto;
    padding-top: 20px;
    font-size: 18px;
    text-align: center;
    color: #56afe2;
    .btn {
      width: 93px;
      height: 30px;
      margin: 0 auto;
      position: relative;
      .read {
        cursor: pointer;
      }
      .go {
        position: absolute;
        right: -20px;
        top: -1px;
      }
      .fade-enter-active {
        animation: mymove .5s ease;
      }
      .fade-leave-active {
        animation: myback .5s ease;
      }
    }
  }
}
</style>

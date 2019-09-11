<template>
    <div class="content">
      <ContentCom
        v-for="item in data"
        :key="item._id"
        :data="item"
        @go="goPath"
      />
      <div class="page">
        <el-pagination
          :page-count="num"
          :total="count"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          >
        </el-pagination>
      </div>
      <div @click="goUp" class="circleUp">
        <i class="el-icon-top"></i>
      </div>
    </div>
</template>

<script>
    import ContentCom from "../../components/Content/Content";
    import * as api from '../../util/api'
    const delay = (function () {
        let timer = 0
        return function (callback, ms) {
            clearTimeout(timer)
            timer = setTimeout(callback, ms)
        }
    })()
    export default {
        name: "Index",
        components: {ContentCom},
        data() {
            return {
                data: [],
                num: 10,
                count: 0,
                page: 1
            }
        },
        created() {
            this.getData(this.$route.query.id || '')
        },
        mounted() {
            // window.addEventListener('scroll', this._throttle(this.handleScroll, 500));
        },
        methods: {
            goPath(id) {
                this.$router.push({
                    path: '/megContent?id=' + id
                })
            },
            async getData(id) {
                let data = await api.get('/front/getContent?id=' + id + '&page=' + this.page)

                this.data = data.data
                this.count = data.page * this.num
            },
            handleCurrentChange(val) {
                this.page = val
                this.getData(this.$route.query.id || '')
            },
            handleScroll() {
                let nowScrool = window.scrollY;
                // console.log(nowScrool)
            },
            _throttle(fn, interval) {
                let last;
                let timer;
                interval = interval || 200;
                return function () {
                    let th = this;
                    let args = arguments;
                    let now = +new Date();

                    if (last && now - last < interval) {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            last = now;
                            fn.apply(th, args);
                        }, interval);
                    } else {
                        last = now;
                        fn.apply(th, args);
                    }

                }

            },
            goUp() {
                window.scroll(0, 0)
            }
        },
        watch: {
            '$route.query.id'(val) {
                this.page = 1
                if (!val) {
                    this.getData('')
                } else {
                    this.getData(val)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  @keyframes up{
    from{
      transform: translateY(0px);
    }
    to{
      transform: translateY(-10px);
    }
  }
.content {
  width: 100%;
  background: rgb(237,237,241);
  padding: 100px 0;
  .page {
    width:auto;
    margin: 0 auto;
    text-align: center;
  }
  .circleUp {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    position: fixed;
    right: 50px;
    bottom: 50px;
    background: #fff;
    cursor: pointer;
    font-weight: bold;
    box-shadow:0px 0px 2px #333;
  }
  .circleUp:hover {
    animation: up .5s infinite alternate;
    box-shadow:0px 0px 10px #333;
  }
}
</style>

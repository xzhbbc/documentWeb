<template>
    <div class="memberWrap">
      <el-table
        :data="memberList"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="create_time"
          label="创建日期"
          width="150">
        </el-table-column>
        <el-table-column
          prop="user"
          label="用户名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="120">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="手机"
          width="120">
        </el-table-column>
        <el-table-column
          prop="Department.name"
          label="所属部门"
          width="300">
        </el-table-column>
        <el-table-column
          label="身份"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.power == 1">负责人</div>
            <div v-if="scope.row.power == 2">部员</div>
            <div v-if="scope.row.power == 3">访客</div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">停用</div>
            <div v-if="scope.row.status == 1">可用</div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="修改身份"
          width="120">
          <template slot-scope="scope">
            <el-select @change="changePower(scope.row)" v-model="scope.row.power" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="修改状态"
          width="150">
          <template slot-scope="scope">
            <el-switch
              style="display: block"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="可用"
              @change="changeStatus(scope.row)"
              inactive-text="停用">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    import * as api from '../../../util/api'
    import moment from 'moment'

    export default {
        name: "Member",
        data() {
            return {
                memberList: [],
                options: [{
                    value: 1,
                    label: '负责人'
                }, {
                    value: 2,
                    label: '部员',
                }, {
                    value: 3,
                    label: '访客'
                }]
            }
        },
        created() {
            this.getData()
        },
        methods: {
          async getData() {
              let data = await api.get('/department/getMember')
              this.memberList = data.map(res => {
                  res.create_time = this.renderTime(res.create_time)
                  return res
              })
              // console.log(data)
          },
          renderTime(date) {
              return moment(date).format('YYYY-MM-DD HH:mm')
          },
          async changeStatus(row) {
            let fixStatus = await api.post('/department/stopMember', {
                status: row.status,
                id: row._id
            })
          },
          async changePower(row) {
              let fixPower = await api.post('/department/fixPower', {
                  power: row.power,
                  id: row._id
              })
          }
        }
    }
</script>

<style lang="less" scoped>
.memberWrap {
  width: 80%;
  margin: 0 auto;
  padding-bottom: 50px;
}
</style>

<template>
    <div class="departmentWrap">
      <el-table
        :data="departmentList"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="封面">
<!--                <span>{{ props.row.name }}</span>-->
                <img v-if="props.row.img" :src="props.row.img"/>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="部门"
          prop="name">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="goFix(scope.row)" size="small" type="warning">修改</el-button>
            <el-button @click="del(scope.row)" size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    import * as api from  '../../../util/api'

    export default {
        name: "DepartmentEditor",
        data() {
            return {
                departmentList: [],
            }
        },
        created() {
            this.getData()
        },
        methods: {
            async getData() {
                let data = await api.get('/department/get')

                this.departmentList = data.map(res => {
                    if (res.img) {
                        res.img = res.img.split('views/')[1]
                    }
                    return res
                })
            },
            async del(row) {
                await api.post('/department/remove', {
                    id: row._id
                })
                this.getData()
            },
            goFix(row) {
                this.$router.push('/departmentInput?id=' + row._id)
            }
        }
    }
</script>

<style lang="less" scoped>
.departmentWrap {
  width: 80%;
  margin: 0 auto;
  padding-bottom: 50px;
}
</style>

<template>
    <div class="wrap">
      <div class="inputBox">
        <div class="text">部门名：</div>
        <el-input class="input" v-model="name" placeholder="请输入用户名"></el-input>
      </div>
      <div v-if="this.img!=''" class="nowImg">
        <div class="text">目前封面：</div>
        <img :src="this.img"/>
      </div>
      <div class="inputFile">
        <div class="text">部门封面（选填）：</div>
        <el-upload
          class="upload-demo"
          drag
          :limit="1"
          action="javascript:;"
          ref="upload"
          :auto-upload="false"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-exceed="handleExceed">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
        </el-upload>
      </div>
      <div class="inputBox">
        <el-button class="btn" type="primary" @click="submit">保存</el-button>
      </div>
    </div>
</template>

<script>
    import * as api from '../../../util/api'

    export default {
        name: "DepartmentInput",
        data() {
            return {
                name: '',
                fileList: [],
                img: ''
            }
        },
        created() {
            if (this.$route.query.id) {
                this.getData(this.$route.query.id)
            }
        },
        methods: {
            async getData(id) {
                let data = await api.get('/department/get?id=' + id)
                this.name = data.name
                this.img = data.img.split('views/')[1]
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            async beforeUpload(file) {
                if (file.size > 0) {
                    let fd = new FormData()
                    //  console.log(file)
                    fd.append('file', file)
                    fd.append('name', this.name)
                    if (this.$route.query.id) {
                        fd.append('id', this.$route.query.id)
                    }
                    await api.post('/department/setPhoto', fd)
                    this.getData(this.$route.query.id)
                } else {
                    this.$message.warning('请上传一张图片')
                }
            },
            async submit() {
              if (this.name != '') {
                  if (this.$refs.upload.uploadFiles.length != 0) {
                      this.$refs.upload.submit()
                  } else {
                      if (this.$route.query.id) {
                          //修改
                          await api.post('/department/set', {
                              name: this.name,
                              id: this.$route.query.id
                          })
                          this.getData(this.$route.query.id)
                      } else {
                          //保存
                          await api.post('/department/set', {
                              name: this.name
                          })
                      }
                  }
              } else {
                  this.$message.warning('请填写部门名')
              }
            },
        }
    }
</script>

<style lang="less" scoped>
.wrap {
  width: 80%;
  margin: 0 auto;

  .inputBox {
    width: 100%;
    height: 90px;
    line-height: 45px;
    .btn {
      float: right;
    }
  }

  .nowImg {
    width: 100%;
    padding: 10px 0;
  }

  .inputFile {
    width: 100%;
    height: 350px;
    margin-top: 20px;
    .text {
      margin-bottom: 20px;
    }
  }
}
</style>

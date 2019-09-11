<template>
    <div class="wordSend">
      <div class="input_box">
        <div class="text">标题</div>
        <el-input class="input" v-model="title"/>
      </div>
      <div class="input_box">
        <div class="text">分类(选填)</div>
        <el-input class="input" v-model="tags"/>
      </div>
      <div class="inputFile">
        <div class="text">文件上传（word,pdf,excel）：</div>
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
        </el-upload>
      </div>
      <div class="btnWrap">
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
</template>

<script>
    import * as api from '../../../util/api'
    export default {
        name: "WordSend",
        data() {
            return {
                title: '',
                tags: '',
                fileList: []
            }
        },
        methods: {
            submit() {
                if (this.title != '') {
                    if (this.$refs.upload.uploadFiles.length != 0) {
                        this.$refs.upload.submit()
                    } else {
                        this.$message.warning('请上传一个文件！')
                    }
                } else {
                    this.$message.info('请填写标题！')
                }
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            async beforeUpload(file) {
                if (file.size > 0) {
                    let fd = new FormData()
                     console.log(file)
                    fd.append('title', this.title)
                    fd.append('tags', this.tags)
                    fd.append('file', file)
                    await api.post('/content/uploadFile', fd)
                    // this.getData(this.$route.query.id)
                } else {
                    this.$message.warning('请上传一张图片')
                }
            },
        }
    }
</script>

<style lang="less" scoped>
.wordSend {
  width: 80%;
  margin: 0 auto;
  .btnWrap {
    width: 100px;
    height: 40px;
    float: right;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .input_box .input {
    margin: 10px 0;
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

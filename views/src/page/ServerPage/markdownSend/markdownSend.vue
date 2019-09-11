<template>
    <div class="markdownEditor" id="api1">
      <div class="input_box">
        <div class="text">标题</div>
        <el-input class="input" v-model="title"/>
      </div>
      <div class="input_box">
        <div class="text">分类(选填)</div>
        <el-input class="input" v-model="tags"/>
      </div>
      <mavon-editor class="markdown" v-model="content"/>
      <div class="btnWrap">
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
</template>

<script>
    import marked from 'marked'
    import * as api from '../../../util/api'

    export default {
        name: "markdownSend",
        data() {
            return {
                content: '',
                defaultData: "preview",
                title: '',
                tags: ''
            };
        },
        created() {
            if (this.$route.query.id) {
                this.getMd(this.$route.query.id)
            }
        },
        methods: {
            async getMd(id) {
                let getData = await api.post('/content/getOneContent', {
                    id
                })
                this.content = getData.markDown
                this.title = getData.title
                this.tags = getData.tags
            },
            async submit() {
                if (this.title == '') {
                    return this.$message.info('请填写标题')
                }
                if (this.tags != '') {
                    if (this.tags.length > 10) {
                        return this.$message.info('分类字数不能超过10')
                    }
                }
                if (this.content == '') {
                    return this.$message.info('请填写内容')
                }

                marked.setOptions({
                    renderer: new marked.Renderer(),
                    gfm: true,
                    tables: true,
                    breaks: false,
                    pedantic: false,
                    sanitize: false,
                    smartLists: true,
                    smartypants: false
                });
                let html = marked(this.content)
                let saveContent = ''
                if (this.$route.query.id) {
                    //修改
                    saveContent = await api.post('/content/fixContent', {
                        title: this.title,
                        tags: this.tags,
                        htmlContent: html,
                        markDown: this.content,
                        id: this.$route.query.id
                    })
                } else {
                    saveContent = await api.post('/content/saveMarkdown', {
                        title: this.title,
                        tags: this.tags,
                        htmlContent: html,
                        markDown: this.content
                    })
                }
                if (saveContent == ''&&!this.$route.query.id) {
                    this.$message.success('保存成功！')
                    this.title = ''
                    this.tags = ''
                    this.content = ''
                }
            }
        }
    }
</script>

<style scoped>
.markdownEditor {
  width: 100%;
  height: calc(100vh + 150px);
}
.markdown {
  width: 100%;
  height: calc(100vh - 60px);
}
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
</style>

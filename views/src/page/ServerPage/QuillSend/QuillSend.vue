<template>
    <div class="quillWrap">
      <div class="input_box">
        <div class="text">标题</div>
        <el-input class="input" v-model="title"/>
      </div>
      <div class="input_box">
        <div class="text">分类(选填)</div>
        <el-input class="input" v-model="tags"/>
      </div>
      <quill-editor
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        class="content"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
      >
      </quill-editor>
      <div class="btnWrap">
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
</template>

<script>
    import { quillEditor } from "vue-quill-editor"; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import * as api from '../../../util/api'

    export default {
        components: {
            quillEditor
        },
        name: "QuillSend",
        data() {
            return {
                content: '',
                editorOption: {
                },
                title: '',
                tags: ''
            }
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
                this.content = getData.htmlContent
                this.title = getData.title
                this.tags = getData.tags
            },
            onEditorReady(editor) { // 准备编辑器

            },
            onEditorBlur() { }, // 失去焦点事件
            onEditorFocus() { }, // 获得焦点事件
            onEditorChange() { }, // 内容改变事件
            async submit() {
                if (this.title == '') {
                    return this.$message.info('请填写标题')
                }
                if (this.tags != '') {
                    if (this.tags.length > 10) {
                        return  this.$message.info('分类字数不能超过10')
                    }
                }
                if (this.content == '') {
                    return this.$message.info('请填写内容')
                }

                let saveContent = ''
                if (this.$route.query.id) {
                    //修改
                    saveContent = await api.post('/content/fixContent', {
                        title: this.title,
                        tags: this.tags,
                        htmlContent: this.content,
                        markDown: '',
                        id: this.$route.query.id
                    })
                } else {
                    saveContent = await api.post('/content/saveMarkdown', {
                        title: this.title,
                        tags: this.tags,
                        htmlContent: this.content,
                        markDown: ''
                    })
                }

                if (saveContent == ''&&!this.$route.query.id) {
                    this.$message.success('保存成功！')
                    this.title = ''
                    this.tags = ''
                    this.content = ''
                }
            },
        }
    }
</script>

<style lang="less" scoped>
.quillWrap {
  width: 100%;
  height: calc(100vh + 150px);
  .content {
    width: 100%;
    height: calc(100vh - 130px);
  }
  .input_box .input {
    margin: 10px 0;
  }
  .btnWrap {
    width: 100px;
    height: 40px;
    float: right;
    margin-top: 80px;
    margin-bottom: 10px;
  }
}
</style>

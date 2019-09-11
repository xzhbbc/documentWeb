<template>
    <div class="wordWrap">
<!--      <pdf src="/static/word/test.pdf"/>-->
      <iframe src='https://view.officeapps.live.com/op/view.aspx?src=newteach.pbworks.com%2Ff%2Fele%2Bnewsletter.docx' width='100%' height='100%' frameborder='1'>
      </iframe>
    </div>
</template>

<script>
    import pdf from 'vue-pdf'

    export default {
        name: "WordSee",
        components: {pdf}
    }
</script>

<style scoped>
.wordWrap {
  width: 100%;
  height: 100vh;
}
</style>

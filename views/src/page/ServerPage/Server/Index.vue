<template>
    <div class="index">
      欢迎你的到来，{{user.Department.name}}的{{user.user}}
    </div>
</template>

<script>
    export default {
        name: "Index.vue",
        created() {
            this.$store.commit('getLogin')
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
        }
    }
</script>

<style lang="less" scoped>
.index {
  width: 80%;
  height: 500px;
  margin: 0 auto;
}
</style>

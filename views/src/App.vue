<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
    <header-con/>
    <router-view/>
    <footer-con/>
  </div>
</template>

<script>
import HeaderCon from "./components/Header/Header";
import FooterCon from "./components/Footer/Footer";
export default {
  name: 'App',
    components: {FooterCon, HeaderCon}
}
</script>

<style>
#app {
}
</style>

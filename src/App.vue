<template>
<div>
  <HeaderCom/>

  <FooterCom/>
  <router-link to="/">Home</router-link>
  <router-link to="/about">About</router-link>
</div>
<!-- router-view để hiển thị nội dung của
 component tương ứng với route
 -->
<router-view/>


</template>

<script>
import HeaderCom from './components/HeaderCom.vue'
import FooterCom from './components/FooterCom.vue'

export default {
  name: 'App',
  components: {
    
     HeaderCom,
      FooterCom,
  
    //   ComHome
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div class="main-container">
    <div class="left-bar">
      <p
        v-for="(item, index) in mapList"
        :key="index"
        :class="{'active-class':nowPath == item.path}"
        @click="$router.push(item.path)">
        {{item.name}}
      </p>
    </div>
    <router-view class="router-view"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      mapList:[],
      nowPath: ''
    }
  },
  watch:{
    '$route':{
      handler(val){
        this.nowPath = val.path
      },
      immediate: true

    }
  },
  created(){
    this.mapList = this.$router.options.routes.slice(1)
  }
}
</script>

<style>
.main-container{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
}
.left-bar{
  width: 10%;
  min-width: 200px;
}
.router-view{
  flex: 1;
}
p{
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
}
.active-class{
  color: #000;
}
.map-box{
  height: 100%;
  width: 100%;
  
}
</style>

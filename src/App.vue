<template>
  <div class="main-container">
    <div class="left-bar">
      <p
        v-for="(item, index) in mapList"
        :key="index"
        :class="{'active-class':nowPath == item.link}"
        @click="$router.push(item.link)">
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
      mapList:[
        {name:'基础使用',link:'/mapBasic'},
        {name:'marker标记',link:'/mapMarker'},
        {name:'GeoJson行政区划分',link:'/mapGeoJson'},
        {name:'marker自定义样式',link:'/mapMarkerStyle'},
        {name:'自定义切换图层',link:'/mapChangeLayer'},
        {name:'自定义城市',link:'/mapCitySelect'},
      ],
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

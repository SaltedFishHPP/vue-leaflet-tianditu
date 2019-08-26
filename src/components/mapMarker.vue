<template>
  <div>
    <div id="myMap" class="map-box"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import Provider from './chinatmsproviders'
require('leaflet/dist/leaflet.css')
export default {
  data () {
    return {
      mapKey:'', //你的key
      marker: [],
      mapData: [
        {name:'标记1',tips:'这是标记1',lat:30.16, lng:120.53},
        {name:'标记2',tips:'这是标记2',lat:30.40, lng:120.26},
        {name:'标记3',tips:'这是标记3',lat:30.04, lng:120.41},
        {name:'标记4',tips:'这是标记4',lat:30.03, lng:120.85},
        {name:'标记5',tips:'这是标记5',lat:30.18, lng:120.45},
        {name:'标记6',tips:'这是标记6',lat:30.46, lng:120.24},
      ]
    }
  },
  mounted(){
      Provider(L) // 挂载插件
      this.getMap() 
  },
  methods:{
      getMap(){
        let myCenter = new L.LatLng(30.42,120.30) // 中心点
        let map = L.map('myMap',{
            center: myCenter,
            zoom: 9
        })
        L.tileLayer.chinaProvider('TianDiTu.Normal.Map',{maxZoom:18,minZoom:5,key:this.mapKey}).addTo(map);
        L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion',{maxZoom:18,minZoom:5,key:this.mapKey}).addTo(map);
        this.getPointer(map)
    },
    getPointer(map){
      let _this = this // 防止冲突
      if(this.marker){
          this.marker.map(res=>{
              map.removeLayer(res) // 清空标记
          })
      }
      this.mapData.map((res,index)=>{
          let marker = L.marker([res.lat,res.lng]).addTo(map);
          map.addLayer(marker) // 添加标记
          marker.setIcon(L.icon({   // 标记配置-详见leaflet官网
              iconUrl: require('./icon.png'), // 使用require加载标记图
              iconSize: [20,25],
          }))
          if(index == 0){
            marker.bindPopup(res.tips).openPopup() // 默认展开标记点击弹窗
            marker.bindTooltip(res.name).openTooltip(); //默认展开tooltip
          }else{
            marker.bindPopup(res.tips) // 标记点击弹窗
            marker.bindTooltip(res.name) //标记悬浮弹窗
          }
          // 自定义其他事件
          marker.on('click', ()=>{
            console.log(res.name+'标记的可自定义点击事件');
          });
          this.marker.push(marker) // 保存标记，便于清空
      })
    }
  }
}
</script>
<style scoped>
</style>

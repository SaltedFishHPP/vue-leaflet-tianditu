<template>
  <div>
    <div id="myMap" class="map-box"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import Provider from '@/components/chinatmsproviders'
require('leaflet/dist/leaflet.css')
import geoJson from '@/components/geojson/geojson'

export default {
  data () {
    return {
      mapKey:'', //你的key
    }
  },
  mounted(){
      Provider(L) // 挂载插件
      this.getMap() 
  },
  methods:{
    getMap(){
        let myCenter = new L.LatLng(30.42,120.30)
        let map = L.map('myMap',{
            center: myCenter,
            zoom: 9
        })
        L.tileLayer.chinaProvider('TianDiTu.Normal.Map',{maxZoom:18,minZoom:5,key:this.mapKey}).addTo(map);
        L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion',{maxZoom:18,minZoom:5,key:this.mapKey}).addTo(map);
        L.geoJson(geoJson).addTo(map)
    }
  }
}
</script>
<style scoped>

</style>

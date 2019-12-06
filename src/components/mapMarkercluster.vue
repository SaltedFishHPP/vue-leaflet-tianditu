<template>
  <div>
    <div id="myMap" class="map-box"></div>

    <button class="delete-btns" @click="delMarker">删除</button>
    <!-- <button class="delete-btns" id="delete">删除</button> -->
  </div>
</template>

<script>
import L from "leaflet";
import Provider from "./chinatmsproviders";
require("leaflet/dist/leaflet.css");
import { PruneCluster, PruneClusterForLeaflet } from "exports-loader?PruneCluster,PruneClusterForLeaflet!prunecluster/dist/PruneCluster.js";
export default {
  data() {
    return {
      mapKey: "", //你的key
      marker: [],
      mapData: [
        { name: "标记1", tips: "这是标记1", lat: 30.16, lng: 120.53 },
        { name: "标记2", tips: "这是标记2", lat: 30.4, lng: 120.26 },
        { name: "标记3", tips: "这是标记3", lat: 30.04, lng: 120.41 },
        { name: "标记4", tips: "这是标记4", lat: 30.03, lng: 120.85 },
        { name: "标记5", tips: "这是标记5", lat: 30.18, lng: 120.45 },
        { name: "标记6", tips: "这是标记6", lat: 30.46, lng: 120.24 },
        { name: "标记7", tips: "这是标记7", lat: 30.45, lng: 120.24 },
        { name: "标记8", tips: "这是标记8", lat: 30.44, lng: 120.24 },
        { name: "标记9", tips: "这是标记9", lat: 30.43, lng: 120.24 },
        { name: "标记10", tips: "这是标记10", lat: 30.42, lng: 120.24 },
        { name: "标记11", tips: "这是标记11", lat: 30.45, lng: 120.25 },
        { name: "标记12", tips: "这是标记12", lat: 30.46, lng: 120.25 }
      ],
      map: null,
      leafletView: null,
    };
  },
  mounted() {
    Provider(L); // 挂载插件
    this.getMap();
  },
  methods: {
    // 删除标记
    delMarker(){
      this.leafletView.RemoveMarkers()
    },
    getMap() {
      let myCenter = new L.LatLng(30.16, 120.53); // 中心点
      let map = L.map("myMap", {
        center: myCenter,
        zoom: 9
      });
      L.tileLayer
        .chinaProvider("TianDiTu.Normal.Map", {
          maxZoom: 18,
          minZoom: 5,
          key: this.mapKey
        })
        .addTo(map);
      L.tileLayer
        .chinaProvider("TianDiTu.Normal.Annotion", {
          maxZoom: 18,
          minZoom: 5,
          key: this.mapKey
        })
        .addTo(map);
      this.map = map
      this.getPointer(map);
    },
    getPointer(map) {
      let _this = this; // 防止冲突
      let leafletView =  new PruneClusterForLeaflet()
      this.mapData.map((res, index) => {
        var marker = new PruneCluster.Marker(res.lat, res.lng, res);
        leafletView.PrepareLeafletMarker = function(leafletMarker, data) {
          leafletMarker.setIcon(L.icon({   // 标记配置-详见leaflet官网
              iconUrl: require('../assets/icon.png'), // 使用require加载标记图
              iconSize: [20,25],
          }));
            leafletMarker.on('click', function(e){
              console.log(e,'click');
            });
        };
        leafletView.RegisterMarker(marker);
      });
      // 保存，进行更改前需要保存
      setInterval(()=> {
          leafletView.ProcessView();
      }, 500);


      map.addLayer(leafletView);

      

      this.leafletView = leafletView



      




    }
  }
};
</script>
<style>
@import './pruneCluster/LeafletStyleSheet.css';
.delete-btns{
  z-index: 9999;
  position: absolute;
  bottom: 100px;
  left: 150px;

}




</style>

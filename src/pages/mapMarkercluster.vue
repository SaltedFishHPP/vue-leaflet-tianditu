<template>
    <div>
        <div id="myMap" class="map-box"></div>
        <button class="delete-btns" @click="delMarker">删除</button>
    </div>
</template>

<script>
import L from "leaflet";
import Provider from "@/components/chinatmsproviders";
require("leaflet/dist/leaflet.css");
// 引入PruneCluster
import { PruneCluster, PruneClusterForLeaflet } from "exports-loader?PruneCluster,PruneClusterForLeaflet!prunecluster/dist/PruneCluster.js";
export default {
    data() {
      return {
          mapKey: "", //你的key
          marker: [],
          mapMarker: [],
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
            this.leafletView.RemoveMarkers() // 全部清空，指定清空传入标记点信息
        },
        getMap() {
            let myCenter = new L.LatLng(30.16, 120.53); // 中心点
            let map = L.map("myMap", {
              center: myCenter,
              zoom: 9
            });
            L.tileLayer.chinaProvider("TianDiTu.Normal.Map", {
                maxZoom: 18,
                minZoom: 5,
                key: this.mapKey
            }).addTo(map);
            L.tileLayer.chinaProvider("TianDiTu.Normal.Annotion", {
                maxZoom: 18,
                minZoom: 5,
                key: this.mapKey
            }).addTo(map);
            this.map = map
            this.getPointer(map);
        },
        getPointer(map) {
            let _this = this; // 防止冲突
            // 清空点
            if(Array.isArray(this.mapMarker) && this.mapMarker.length > 0){
                this.leafletView.RemoveMarkers();
                this.mapMarker = []
            }
            // 添加地图图层
            let leafletView =  new PruneClusterForLeaflet() // 可传参配置距离和边距，不传默认距离和边距
            this.mapData.map((res,index)=>{
                // 设置标记点位置
                let marker = new PruneCluster.Marker(res.lat,res.lng);
                // 给标记点传入信息,若是动态更改编辑点，需要进行marker.data赋值，PrepareLeafletMarker中会取最后一次传入的数据覆盖所有
                marker.data.info = res
                marker.data.icon = L.icon({   // 标记配置-详见leaflet官网
                    iconUrl: require('../assets/icon.png'), // 使用require加载标记图
                    iconSize: [20,25],
                })
                // 添加标记点点击事件
                leafletView.PrepareLeafletMarker = function(leafletMarker, data) {
                    // 标记点                  
                    leafletMarker.setIcon(data.icon)
                    leafletMarker.bindTooltip(data.info.name, {
                        direction: 'right' ,
                    })
                    // 取消点击事件，防止加载多次-on('click')事件会不断叠加，导致点击事件触发N次，所以需要先取消之前的所有点击事件
                    leafletMarker.off('click')
                    // 标记点点击事件
                    leafletMarker.on('click', function(e){
                        console.log('我点击了');
                    });
                };
                // 注册标记点
                leafletView.RegisterMarker(marker);
                // 保存标记点-动态显示的时候用到
                this.mapMarker.push(marker)
            })
            // 保存，进行更改前需要保存！这个一定要这样写（暂时还不了解为啥）但是不这样写无法触发事件
            setInterval(()=> {
                leafletView.ProcessView();
            }, 500);

            // 地图中添加地图图层
            map.addLayer(leafletView);

            // 保存地图图层配置
            this.leafletView = leafletView
        }
    }
};
</script>
<style>
@import '../../static/style/LeafletStyleSheet.css';
.delete-btns{
    z-index: 9999;
    position: absolute;
    bottom: 100px;
    left: 200px;
}




</style>

<template>
    <div>
        <div id="myMap" class="map-box"></div>
    </div>
</template>

<script>
import L from "leaflet";
import Provider from "@/components/chinatmsproviders";
require("leaflet/dist/leaflet.css");
import geoJson from "@/components/geojson/geojson";

export default {
    data() {
        return {
            mapKey: "", //你的key
            map: null,
            maskArea: null // 保存图形
        };
    },
    mounted() {
        Provider(L); // 挂载插件
        this.getMap();
    },
    methods: {
        getMap() {
            let _this = this
            // 绘制地图地图
            let myCenter = new L.LatLng(30.42, 120.3); // 地图中心点
            let map = L.map("myMap", {
              center: myCenter,
              zoom: 9
            });
            L.tileLayer .chinaProvider("TianDiTu.Normal.Map", {
                maxZoom: 18,
                minZoom: 5,
                key: this.mapKey
            }).addTo(map);
            L.tileLayer.chinaProvider("TianDiTu.Normal.Annotion", {
                maxZoom: 18,
                minZoom: 5,
                key: this.mapKey
            }).addTo(map);


            // 设置行政区域样式
            L.geoJSON(geoJson, {
                style: function(feature) {
                    return { fillOpacity: feature.properties.fillOpacity };
                }
            }).addTo(map);
            this.map = map
            // 监听缩放地图事件
            map.on("zoomend", function(e) {
                _this.drawBoundary();
            });
            // 监听拖动地图事件
            map.on("moveend", function (e) {
                _this.drawBoundary();
            });
            // 反选
            this.drawBoundary();
        },

        // 反选 添加外部边界
        drawBoundary() {
            let map = this.map
            // 加载geo中的经纬点
            let coordArr = geoJson.features[0].geometry.coordinates
            // 获取此时地图的四个角经纬度
            var mapNW = map.getBounds().getNorthWest();
            var mapNE = map.getBounds().getNorthEast();
            var mapSE = map.getBounds().getSouthEast();
            var mapSW = map.getBounds().getSouthWest();

            // 添加到闭合图形中
            var maskArr = [];
            maskArr.push(mapNW);
            maskArr.push(mapSW);
            maskArr.push(mapSE);
            maskArr.push(mapNE);
            maskArr.push(mapNW); // 设置为闭合区域的起点

            // 添加各闭合点      
            coordArr.map(res=>{
                var points = [];        
                res.map(subRes => {
                    subRes.map(item => {
                        points.push({ lat: item[1], lng: item[0] });
                    });
                });
                
                //将闭合区域加到遮罩层上，每次添加完后要再加一次西北角作为下次添加的起点和最后一次的终点
                maskArr = maskArr.concat(points);
                maskArr.push(maskArr[0]);
            })

            // 移除图层-不移除图层会不断叠加遮罩
            if(this.maskArea){
                this.maskArea.remove(map)
                this.maskArea = null
            }
            // 添加遮罩
            var maskArea = L.polygon(maskArr, {
                color: "transparent", // 边界颜色
                fillColor: "#B7D2EA", // 填充色
                fillOpacity: 0.8, // 填充透明度
            });
            maskArea.addTo(map);
            this.maskArea = maskArea
        }
    }
};
</script>
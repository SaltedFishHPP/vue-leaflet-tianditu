<template>
  <div class="map-change-layer-container">
    <div id="myMap" class="map-box"></div>
    <div class="map-select-box">
        <div class="map-select-content" ref="mapSelectBox">
            <svg class="iconfont-color" aria-hidden="true" @click="mapSelectShow()">
                <use xlink:href="#icon-qiehuanditu"></use>
            </svg>
            <div
                v-show="isMapSelectShow"
                class="map-data"
                v-for="(item, index) in mapSelectList"
                :key="index"
                :style="{backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage:  'url(\''+item.url+'\')'}"
                @click="changeMapType(item.value)">
                <p
                    class="map-type"
                    :class="{'map-select':mapType == item.value}">
                    <span class="map-type-name">{{item.name}}</span>
                </p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import Provider from '@/components/chinatmsproviders'
require('leaflet/dist/leaflet.css')
export default {
  data () {
    return {
        mapKey:'', // 你的key
        mapType: 'Normal', // 默认地图展示形式
        mapSelectList:[
            {name:'卫星', url:require('@/assets/satellite.png'),value:'Satellite'},
            {name:'矢量', url:require('@/assets/normal.png'),value:'Normal'},
            {name:'地形', url:require('@/assets/terrain.png'),value:'Terrain'},
        ],
        isMapSelectShow: false, // 展开和隐藏
        mapLayer:{},
    }
  },
  mounted(){
    Provider(L) // 挂载插件
    this.getMap()
  },
  methods:{
    getMap(){
        let _this = this
        let myCenter = new L.LatLng(30.40,119.97)
        // 封装方法，不然要重复写很多次
        function mapLoad(value){
            return L.tileLayer.chinaProvider(`TianDiTu.${value}`, {
                maxZoom: 13,
                minZoom: 5,
                key:_this.mapKey
            })
        }
        // 定义地图图层，官方api有
        var norMap = mapLoad('Normal.Map'),
            norAnnotion = mapLoad('Normal.Annotion'),
            sateMap = mapLoad('Satellite.Map'),
            sateAnnotion = mapLoad('Satellite.Annotion'),
            terMap = mapLoad('Terrain.Map'),
            terAnnotion = mapLoad('Terrain.Annotion');
        var normalMap = L.layerGroup([norMap, norAnnotion]),// 矢量
            satelliteMap = L.layerGroup([sateMap, sateAnnotion]), // 卫星
            terrainMap = L.layerGroup([terMap, terAnnotion]); // 地形
        // 名字要和data中的mapSelectList中value值对应
        var baseLayers = {
            "Normal": normalMap,
            "Satellite": satelliteMap,
            'Terrain': terrainMap
        }
        let map = L.map('myMap',{
            center: myCenter,
            zoom: 11,
            layers: [normalMap], //默认图层展示
        })
        // 加载切换地图的功能（出现在页面右上角，可通过css隐藏）
        L.control.layers(baseLayers, null).addTo(map); 

        map.on('click',function (e) {
            // 地图点击事件，隐藏dom
            _this.$refs.mapSelectBox.style.width = '40px'
            setTimeout(() => {
                _this.isMapSelectShow = false
            }, 220);
        })

        // 保存切换地图功能的dom,为了保证保存的dom的正确性，尽量写详细
        for(let node of document.querySelectorAll('.leaflet-control-layers-base label')){
            this.mapLayer[node.innerText.trim()] = node.querySelector('input')
        }
    },
    // 模拟点击
    changeMapType(value){
        this.mapType = value
        this.mapLayer[value].click()
    },
    // 展开和隐藏效果
    mapSelectShow(){
        this.isMapSelectShow = !this.isMapSelectShow
        if(this.isMapSelectShow){
            this.$refs.mapSelectBox.style.width = '300px'
        }else{
            this.$refs.mapSelectBox.style.width = '40px'
        }
    },
  }
}
</script>
<style>
.map-select-box{
    position: absolute;
    right: 21px;
    z-index: 650;
    bottom: 50px;
}
.map-select-content{
    transition: all 400ms;
    width: 40px;
    /* height: 40px; */
    top:0;
    float: right;
    display: flex;
    flex-direction: row;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    position: relative;    
    font-size: 14px;
}
.iconfont-color{
    width: 50px;
    height: 50px;
    cursor: pointer;
    margin: auto 0;
}
.map-data{
    width: 80px;
    height: 50px;
    margin: 5px;
    margin-left: 0;
    line-height: 50px;
    cursor: pointer;
}
.map-type{
    width: 14px;
    font-size: 14px;
    height: 100%;
    float: right;
    line-height: 50px;
    background: #2583F4;
    overflow: hidden;
    padding: 0;
    margin: 0;
}
.map-type-name{
    display: inline-block;
    vertical-align: middle;
    line-height: 25px;
    color: #fff;
}
.map-select{
    background: #00263d;
}

</style>

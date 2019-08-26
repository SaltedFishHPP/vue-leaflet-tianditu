<template>
  <div>
    <div id="myMap" class="map-box"></div>
        <div class="legend-container">
            <p class="legend-title">图例</p>
            <div class="legend-content" >
                <p v-for="(item, index) in pointCheck" :key="index">
                    <input name="Fruit" type="checkbox" :label="item.name" @click="selectIcon($event)"/>
                    <i :class="'iconfont '+item.icon"></i>{{item.name}}
                </p> 
            </div>
        </div>
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
        {name:'标记1',tips:'这是标记1',lat:30.16, lng:120.53,type:'warning',status:-1},
        {name:'标记2',tips:'这是标记2',lat:30.40, lng:120.26,type:'warning',status:0},
        {name:'标记3',tips:'这是标记3',lat:30.04, lng:120.41,type:'warning',status:0},
        {name:'标记4',tips:'这是标记4',lat:30.03, lng:120.85,type:'watch',status:-1},
        {name:'标记5',tips:'这是标记5',lat:30.18, lng:120.45,type:'watch',status:0},
        {name:'标记6',tips:'这是标记6',lat:30.46, lng:120.24,type:'watch',status:0},
      ],
      pointSelect: ['预警点','监测点'],
      pointCheck: [
          {icon:'icon-tufashijian',name:'预警点'},
          {icon:'icon-shexiangtou',name:'监测点'},
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
        let htmlPoint = ''
        let pointIcon = ''
        if(this.marker){
            this.marker.map(res=>{
                map.removeLayer(res) // 清空标记
            })
        }
        this.mapData.map((res,index)=>{
            pointIcon = _this.getIcon(res.type,res.status)//返回图标的配置
            htmlPoint = `<span class="icon-bg"><i class="iconfont ${pointIcon.status} ${pointIcon.icon}"></i></span>` // 使用css统一修改颜色
            let marker = L.marker([res.lat,res.lng]).addTo(map);
            map.addLayer(marker) // 添加标记
            marker.setIcon(L.divIcon({   // 标记配置-详见leaflet官网
                html: htmlPoint,
                className: `point-tips` // 设置marker的class名
            }))
            
            // 自定义其他事件
            marker.on('click', ()=>{
                console.log(res.name+'标记的可自定义点击事件');
            });
            this.marker.push(marker) // 保存标记，便于清空
      })
    },
    getIcon(type,status){
        let pointIcon = {}
        // 根据点击切换图标
        if(type == 'warning'){
            pointIcon.icon = 'icon-tufashijian'
        }else{
            pointIcon.icon = 'icon-shexiangtou'
        }
        if(status == -1){
            // 状态-1为离线
            pointIcon.status = 'icon-close'
        }else{
            pointIcon.status = ''
        }
        return pointIcon
    },
    selectIcon(e){
        console.log(e,'eee');
        

    }
  }
}
</script>
<style scoped>
.icon-tufashijian{
    color:#FF4931;
    background:#FF4931;
}
.icon-shexiangtou{
    color:#4CCB64;
    background:#4CCB64;
}
.icon-close{
    color: gray;
    background:gray;
}

.point-tips{
    width: 0.36rem!important;
    height: 0.36rem!important;
    line-height: 0.36rem;
}
.icon-bg{
    background: #fff;
    border-radius: 50%;
    position: relative;
    left: -0.1rem;
    top: -0.2rem;
    width: 0.3rem;
    height: 0.3rem;
    text-align: center;
    display: inline-block;
}
.icon-normal{
    font-size: 0.36rem;
    position: relative;
    left: -0.03rem;
    background: none;
}
.tool-div{
    color: #fff;
    /* background: #2A5D96; */
    border: none;
    height: 0.34rem;
    line-height: 0.38rem;
    padding: 0 0.15rem 0 0.36rem;
    border-radius: 0.3rem;
}

.legend-container{
    position: relative;
    z-index: 650;
    top: -150px;
    left: 0.31px;
    background: rgba(252, 252, 251, 0.92);
    width: 170px;
    padding: 10px 0;
    color: #515151;
    font-size: 16px;
}
.legend-title{
    color: #010101;
    height: 10px;
    line-height: 10px;
    padding: 0 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
}
.iconfont{
    font-size: 18px;
    background: none;
}
</style>

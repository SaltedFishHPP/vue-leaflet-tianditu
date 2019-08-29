<template>
  <div>
    <div id="myMap" class="map-box"></div>
        <div class="legend-container">
            <p class="legend-title">图例</p>
            <div>
                <p v-for="(item, index) in pointCheck" :key="index">
                    <input name="Fruit" type="checkbox" v-model="pointSelect" :value="item.value" :label="item.name"/>
                    <i class="legend-icon iconfont" :class="item.icon"></i>{{item.name}}
                </p> 
                <span class="legend-tips">灰色为离线装置</span>
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
      // 初始的标记点，由后台返回（有后台接口时不需要设置）
      mapOriginData: [
        {name:'标记1',tips:'这是标记1',lat:30.16, lng:120.53,type:'warning',status:-1},
        {name:'标记2',tips:'这是标记2',lat:30.40, lng:120.26,type:'warning',status:0},
        {name:'标记3',tips:'这是标记3',lat:30.04, lng:120.41,type:'warning',status:0},
        {name:'标记4',tips:'这是标记4',lat:30.03, lng:120.85,type:'watch',status:-1},
        {name:'标记5',tips:'这是标记5',lat:30.18, lng:120.45,type:'watch',status:0},
        {name:'标记6',tips:'这是标记6',lat:30.46, lng:120.24,type:'watch',status:0},
      ],
      mapData:[],
      pointSelect: ['warning','watch'],
      pointCheck: [
          {icon:'icon-tufashijian',name:'预警点1',value:'warning',checked:true},
          {icon:'icon-tufashijian1',name:'预警点2',value:'watch',checked: true},
      ],
      map: null
    }
  },
  mounted(){
      this.mapData = this.mapOriginData
      Provider(L) // 挂载插件
      this.getMap() 
  },
  watch:{
    pointSelect(val){
        let data = []
        // 这里是静态数据模拟，实际项目里由后台传值过来
        val.map(res=>{
            this.mapOriginData.map(val=>{
                if(res == val.type){
                    data.push(val)
                }
            })
        })
        this.mapData = data
        this.getPointer()
    }
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
        this.map = map
        this.getPointer()
    },
    getPointer(){
        let _this = this // 防止冲突
        let map = _this.map
        let htmlPoint = ''
        let pointIcon = ''
        if(this.marker){
            this.marker.map(res=>{
                map.removeLayer(res) // 清空标记
            })
        }
        this.mapData.map((res,index)=>{
            pointIcon = _this.getIcon(res.type,res.status)//返回图标的配置
            htmlPoint = `<span class="icon-bg"><i class="iconfont icon-map ${pointIcon.icon} ${pointIcon.status}"></i></span>` // 使用css统一修改颜色
            let marker = L.marker([res.lat,res.lng]).addTo(map);
            map.addLayer(marker) // 添加标记
            // 标记配置-详见leaflet官网
            marker.setIcon(L.divIcon({
                html: htmlPoint,
                // className: `` // 可以自定义marker的class名
            }))

            // 添加鼠标悬浮事件
            marker.bindTooltip(res.name, {
                direction: 'right' ,
                className: `tool-div ${pointIcon.icon} ${pointIcon.status}`,
                offset: [-20, -10] 
            })
            
            // 自定义其他事件
            marker.on('click', ()=>{
                console.log(res.name+'标记的可自定义点击事件');
            });
            this.marker.push(marker) // 保存标记，便于清空
      })
    },
    getIcon(type,status){
        let pointIcon = {}
        // 根据类型切换图标
        if(type == 'warning'){
            pointIcon.icon = 'icon-tufashijian'
        }else{
            pointIcon.icon = 'icon-tufashijian1'
        }
        if(status == -1){
            // 状态-1为离线
            pointIcon.status = 'icon-close'
        }else{
            pointIcon.status = ''
        }
        return pointIcon
    }
  }
}
</script>
<style>
.icon-tufashijian{
    color:#FF4931;
    background:#FF4931;
}
.icon-tufashijian1{
    color:#4CCB64;
    background:#4CCB64;
}
.icon-close{
    color: gray;
    background:gray;
}
.iconfont{
    font-size: 30px;
    background: none;
}
.legend-icon{
    font-size: 18px;
}
.icon-bg{
    /*自定位图表的位置会有点便宜，需要设置位置*/
    background: #fff;
    border-radius: 50%;
    position: relative;
    left: -8px;
    top: -16px;
    width: 20px;
    height: 20px;
    text-align: center;
    display: inline-block;
}
.icon-map{
    position: relative;
    left: -3px;
    top: -8px;
    background: none;
}
.tool-div{
    color: #fff;
    border: none;
    height: 25px;
    line-height: 25px;
    padding: 0 15px 0 36px;
    border-radius: 30px;
}
.leaflet-tooltip-pane{
    z-index: 200;
}
/* 将原来的定位点隐藏 */
.leaflet-marker-icon{
    width: 0!important;
    height: 0!important;
}
/* tooltip左侧的小箭头 */
.leaflet-tooltip-right:before{
    opacity: 0;
}
.legend-container{
    position: relative;
    z-index: 650;
    top: -160px;
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
.legend-tips{
    font-size: 14px;
    color: #666;
}


</style>

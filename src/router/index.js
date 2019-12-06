import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
let routerArr = [
  {
      path: '/',
      redirect: '/mapBasic'
  },
  {
    path: '/mapBasic',
    name: '基础使用',
    component: resolve => require(['@/pages/mapBasic'], resolve),
  },
  {
    path: '/mapMarker',
    name: 'marker标记',
    component: resolve => require(['@/pages/mapMarker'], resolve),
  },
  {
    path: '/mapGeoJson',
    name: 'GeoJson行政区划分',
    component: resolve => require(['@/pages/mapGeoJson'], resolve),
  },
  {
    path: '/mapGeoJsonInvert',
    name: 'GeoJson行政区划分反选',
    component: resolve => require(['@/pages/mapGeoJsonInvert'], resolve),
  },
  {
    path: '/mapMarkerStyle',
    name: 'marker自定义样式',
    component: resolve => require(['@/pages/mapMarkerStyle'], resolve),
  },
  {
    path: '/mapChangeLayer',
    name: '自定义切换图层',
    component: resolve => require(['@/pages/mapChangeLayer'], resolve),
  },
  {
    path: '/mapCitySelect',
    name: '自定义城市',
    component: resolve => require(['@/pages/mapCitySelect'], resolve),
  },
  {
    path: '/mapMarkercluster',
    name: 'markercluster点聚合',
    component: resolve => require(['@/pages/mapMarkercluster'], resolve),
  },
  



  
]

export default new Router({
  mode: 'history',
  routes: routerArr
})

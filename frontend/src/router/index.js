import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import FindXYZ from '@/components/FindXYZ'
import NotFound from '@/components/NotFound'
import PlaceList from '@/components/PlaceList'
import Cv from '@/components/Cv'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/XYZ',
      name: 'FindXYZ',
      component: FindXYZ
    },
    {
      path: '/places',
      name: 'PlaceList',
      component: PlaceList
    },
    {
      path: '/cv',
      name: 'Cv',
      component: Cv
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

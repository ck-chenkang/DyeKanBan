import Vue from 'vue'
import Router from 'vue-router'
import Kanban from '@/components/Setex.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'kanban',
      component: Kanban
    }
  ]
})

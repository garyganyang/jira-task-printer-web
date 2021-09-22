import Vue from 'vue';
import VueRouter from 'vue-router';
import TaskPrinter from '../views/taskPrinter/TaskPrinter.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TaskPrinter,
  },
  {
    path: '/task-printer',
    name: 'TaskPrinter',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: TaskPrinter,
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes,
});

export default router;

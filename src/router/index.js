import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/",
    name: "welcome",
    component: () => import("@/views/Welcome.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

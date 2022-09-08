import Vue from "vue";
import VueRouter from "vue-router";

const Main = () => import("../views/Main.vue");
const Register = () => import("../views/Register.vue");
const NotFound = () => import("../views/404.vue");
const Login = () => import("../views/Login.vue");
const Home = () => import("../views/home/Home.vue");
const infoShow = () => import("../views/infoShow.vue");

const CGGL = () => import("../views/cggl/cggl.vue");
const WXGL = () => import("../views/wxgl/wxgl.vue");
const ZCGL = () => import("../views/zcgl/zcgl.vue");
const JHGL = () => import("../views/jhgl/jhgl.vue");

const QXGL = () => import("../views/qxgl/qxgl.vue");
const YHGL = () => import("../views/qxgl/yhgl.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/register",
  },

  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "*",
    name: "/404",
    component: NotFound,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/Main",
    name: "Main",
    component: Main,
    children: [
      {
        path: "",
        redirect: "infoShow",
      },
      {
        path: "home",
        name: "home",
        component: Home,
      },
      {
        path: "jhgl",
        name: "借还管理",
        component: JHGL,
      },
      {
        path: "cggl",
        name: "采购管理",
        component: CGGL,
      },
      {
        path: "wxgl",
        name: "维修管理",
        component: WXGL,
      },

      {
        path: "zcgl",
        name: "资产管理",
        component: ZCGL,
      },

      {
        path: "qxgl",
        name: "权限管理",
        component: QXGL,
        children: [
          {
            path: "",
            redirect: "yhgl",
          },
          {
            path: "yhgl",
            name: "用户管理",
            component: YHGL,
          },
        ],
      },
      {
        path: "infoShow",
        name: "个人中心",
        component: infoShow,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
});

export default router;

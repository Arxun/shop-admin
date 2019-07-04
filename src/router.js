import Vue from "vue";
import Router from "vue-router";
import Login from "./views/login.vue";
import Home from "./views/home.vue";
import Users from "./views/users.vue"
import Rights from "./views/rights.vue"
import Roles from "./views/roles.vue"
import Goods from "./views/goods.vue"
import Categories from "./views/categories.vue"
import GoodsAdd from "./views/goods-add.vue"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: Login
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/users",
          component: Users
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/roles",
          component: Roles
        },
        {
          path: "/goods",
          component: Goods
        },
        {
          path: "/categories",
          component: Categories
        },
        {
          path: "/goods-add",
          component: GoodsAdd
        }
      ]
    }
  ]
});

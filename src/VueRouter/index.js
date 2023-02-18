import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Content from "@/components/TheContent/Content";
import SignIn from "@/components/TheContent/SignIn";
import SignUp from "@/components/TheContent/SignUp";
import AccountInfo from "@/components/TheContent/AccountInfo";
import Cart from "@/components/TheContent/Cart";
import DetailView from "@/components/Bases/DetailView";
import ListDetailView from "@/components/Bases/ListDetailView";
const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Content },
  { path: "/category/:name",name:"listDetailView", component: ListDetailView},
  { path: "/signin", component: SignIn },
  { path: "/signup", component: SignUp },
  { path: "/infomation", component: AccountInfo },
  { path: "/cart", component: Cart },
  { path: "/detail/:id", component: DetailView },
  { path: "/listdetail/:search", component: ListDetailView },
];

const router = new VueRouter({ mode: "history", routes });

export default router;

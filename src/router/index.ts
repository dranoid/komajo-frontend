import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../components/AllTransactions.vue"),
  },
  {
    path: "/test-pay",
    name: "pay",
    component: () => import("../components/PayToWallet.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;

import { createWebHistory, createRouter } from "vue-router";
import HomeVue from "../Home.vue";
import AppVue from "../App.vue";


import { type IStaticMethods } from "preline/preline";
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}


const routes = [
    {
        path: "/",
        name: "home",
        component: AppVue
    },
    {
        path: "/dwn",
        name: "dwn",
        component: HomeVue,
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.afterEach((to, from, failure) => {
    if (!failure) {
      setTimeout(() => {
        window.HSStaticMethods.autoInit();
      }, 100)
    }
  });



export default router;
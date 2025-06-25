import { createRouter, createWebHistory } from 'vue-router'
import PisteLaskuri from '../views/LaskuriView.vue'
import TulosLista from "@/components/TulosLista.vue";

const router = createRouter({
  history: createWebHistory('/sra-ampumakoe-laskuri/'),
  routes: [
    {
      path: '/',
      name: 'tuloslista',
      component: TulosLista
    },
    {
      path: '/kirjaus/:rasti/:ampuja',
      name: 'kirjaus',
      component: PisteLaskuri
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/turvallisuus',
      name: 'turvallisuus',
      component: () => import('../views/TurvallisuusView.vue')
    },
    {
      path: '/saannot',
      name: 'saannot',
      component: () => import('../views/Saannot.vue')
    },
    {
      // path: "*",
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: false
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else {
      return { top: 0 };
    }
  },
})

export default router

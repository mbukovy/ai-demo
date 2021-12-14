import MainLayout from 'layouts/MainLayout';
import Evolution from 'pages/Evolution';

const routes = [
  {
    path: '/',
    redirect: {
      name: 'evolution',
    },
  },
  {
    path: '/',
    component: () => MainLayout,
    children: [
      {
        path: 'evolution',
        name: 'evolution',
        meta: {
          title: 'Evolution',
        },
        component: () => Evolution,
      },
      {
        path: 'knn',
        name: 'knn',
        meta: {
          title: 'K-NN',
        },
        component: () => import('pages/Knn.vue'),
      },
      {
        path: 'kmeans',
        name: 'kmeans',
        meta: {
          title: 'K-means',
        },
        component: () => import('pages/Evolution.vue'),
      },
      {
        path: 'regression',
        name: 'regression',
        meta: {
          title: 'Linear Regression',
        },
        component: () => import('pages/Evolution.vue'),
      },
      {
        path: 'nn',
        name: 'nn',
        meta: {
          title: 'Neural Network',
        },
        component: () => import('pages/Evolution.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

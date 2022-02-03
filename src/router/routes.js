import MainLayout from 'layouts/MainLayout';
import Evolution from 'pages/Evolution';
import NeuralNetwork from 'pages/NeuralNetwork';

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
        component: () => import('pages/Kmeans.vue'),
      },
      {
        path: 'kmeans-image',
        name: 'kmeans-image',
        meta: {
          title: 'K-means Image',
        },
        component: () => import('pages/KmeansImage.vue'),
      },
      {
        path: 'nn',
        name: 'nn',
        meta: {
          title: 'Neural Network',
        },
        component: () => NeuralNetwork,
      },
      {
        path: 'digits',
        name: 'digits',
        meta: {
          title: 'Digits',
        },
        component: () => import('pages/Digits.vue'),
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

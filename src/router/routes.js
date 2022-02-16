import MainLayout from 'layouts/MainLayout';
import Evolution from 'pages/Evolution';
import NeuralNetwork from 'pages/NeuralNetwork';
import Knn from 'pages/Knn';
import Kmeans from 'pages/Kmeans';
import KmeansImage from 'pages/KmeansImage';
import Digits from 'pages/Digits';
import Error404 from 'pages/Error404';

const routes = [
  {
    path: '/',
    redirect: {
      name: 'evolution',
    },
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'evolution',
        name: 'evolution',
        meta: {
          title: 'Evolution',
        },
        component: Evolution,
      },
      {
        path: 'knn',
        name: 'knn',
        meta: {
          title: 'K-NN',
        },
        component: Knn,
      },
      {
        path: 'kmeans',
        name: 'kmeans',
        meta: {
          title: 'K-means',
        },
        component: Kmeans,
      },
      {
        path: 'kmeans-image',
        name: 'kmeans-image',
        meta: {
          title: 'K-means Image',
        },
        component: KmeansImage,
      },
      {
        path: 'nn',
        name: 'nn',
        meta: {
          title: 'Neural Network',
        },
        component: NeuralNetwork,
      },
      {
        path: 'digits',
        name: 'digits',
        meta: {
          title: 'Digits',
        },
        component: Digits,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: Error404,
  },
];

export default routes;

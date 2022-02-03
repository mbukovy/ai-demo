<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          AI Introduction
        </q-toolbar-title>

        <q-btn
          class="q-mx-md"
          icon="dark_mode"
          flat
          round
          dense
          @click="$q.dark.toggle()"
        />
        <div>{{ $route.meta.title }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <MenuLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          @click="toggleLeftDrawer"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuLink from 'components/MenuLink.vue';

const linksList = [
  {
    title: 'Genetic Algorithm',
    caption: 'Optimization',
    icon: 'transgender',
    route: {
      name: 'evolution',
    },
  },
  {
    title: 'K-means',
    caption: 'Unsupervised learning, Clustering',
    icon: 'scatter_plot',
    route: {
      name: 'kmeans',
    },
  },
  {
    title: 'K-means Img',
    caption: 'Image preprocessing',
    icon: 'image',
    route: {
      name: 'kmeans-image',
    },
  },
  {
    title: 'K-NN',
    caption: 'K Nearest Neighbors, Classification',
    icon: 'share',
    route: {
      name: 'knn',
    },
  },
  {
    title: 'Neural Network',
    caption: 'Classification',
    icon: 'account_tree',
    route: {
      name: 'nn',
    },
  },
  {
    title: 'Digits',
    caption: 'Hand-written digits recognition',
    icon: 'pin',
    route: {
      name: 'digits',
    },
  },
];

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    MenuLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

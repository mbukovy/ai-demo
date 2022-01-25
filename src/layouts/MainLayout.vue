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

        <EssentialLink
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
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Evolution',
    caption: 'Optimization',
    icon: 'school',
    route: {
      name: 'evolution',
    },
  },
  {
    title: 'K-NN',
    caption: 'K nearest neighbors, Classification',
    icon: 'school',
    route: {
      name: 'knn',
    },
  },
  {
    title: 'K-means',
    caption: 'Unsupervised learning, Clustering',
    icon: 'school',
    route: {
      name: 'kmeans',
    },
  },
  {
    title: 'K-means Img',
    caption: 'Image compression',
    icon: 'school',
    route: {
      name: 'kmeans-image',
    },
  },
  {
    title: 'Regression',
    caption: 'Linear regression, Classification',
    icon: 'school',
    route: {
      name: 'regression',
    },
  },
  {
    title: '(ML) Neural Network',
    caption: 'Classification',
    icon: 'school',
    route: {
      name: 'nn',
    },
  },
];

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
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

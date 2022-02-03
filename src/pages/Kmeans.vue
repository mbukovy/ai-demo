<template>
  <q-page class="flex row">
    <div class="col-9 q-pa-sm">
      <div class="q-my-md row">
        <div class="col">
          <b>DATASET ({{ dataset.length }})</b>
          <div class="flex">
            <ColorSquare
              v-for="(item) in dataset"
              :key="item.id"
              :color="getSquareColor(item)"
              :title="`${item.r}, ${item.g}, ${item.b}`"
            />
          </div>
        </div>
        <div class="col">
          <b>CLUSTERS</b>
          <div
            v-for="cluster in clusters"
            :key="cluster.clusterId"
          >
            <div class="row align-items-center">
              <ColorSquare :color="getSquareColor(cluster.color)" />
              <b>CLUSTER {{ cluster.number }}</b>
            </div>

            <div class="flex">
              <ColorSquare
                v-for="(item) in cluster.dataset"
                :key="item.id"
                :color="getSquareColor(item)"
                :title="`${item.r}, ${item.g}, ${item.b}`"
              />
            </div>
            <q-separator />
          </div>
        </div>
      </div>
    </div>

    <div class="col-3 q-pa-sm">
      <q-input
        v-model="k"
        outlined
        type="number"
        prefix="K ="
      />
      <br>
      <q-btn
        label="RUN K-MEANS"
        @click="run"
      />
    </div>
  </q-page>
</template>

<script>
import ColorSquare from 'components/ColorSquare';
import { generateDataset } from 'src/utils/color';
import { optimizedKmeans } from 'src/utils/kmeans';

export default {
  name: 'PageKmeans',

  components: { ColorSquare },

  data() {
    return {
      datasetSize: 100,
      dataset: [],
      k: 3,
      clusters: [],
    };
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      this.dataset = generateDataset(this.datasetSize);
    },

    getSquareColor(square) {
      return `rgb(${[square.r, square.g, square.b].join(',')})`;
    },

    run() {
      const { clusters } = optimizedKmeans(this.k, this.dataset);
      this.clusters = clusters;
    },
  },
};
</script>

<style scoped>
.align-items-center {
  align-items: center;
}
</style>

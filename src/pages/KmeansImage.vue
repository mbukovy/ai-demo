<template>
  <q-page class="flex row">
    <div class="col-9 q-pa-sm">
      <div class="row">
        <div class="col-md-12 col-lg-6">
          <input
            ref="fileInput"
            type="file"
            hidden
            @change="replaceImage"
          >
          <q-icon
            name="upload"
            @click="$refs.fileInput.click()"
          />
          ORIGINAL ({{ size }}x{{ size }}) <br>
          <img
            ref="image"
            :src="`https://random.imagecdn.app/${size}/${size}?random=${uid}`"
            :style="{height: `${size}px`, width: `${size}px`}"
            @load="init"
          >
        </div>
        <div class="col-md-12 col-lg-6">
          CANVAS <br>
          <canvas
            ref="canvas"
            :width="size"
            :height="size"
          />
          <div
            v-if="repreColors.length"
            class="flex"
          >
            Characteristic Colors
            <ColorSquare
              v-for="color in repreColors"
              :key="color.id"
              :color="getSquareColor(color)"
            />
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
        label="RUN"
        @click="run"
      />
      <span v-show="running">RUNNING</span>
    </div>
  </q-page>
</template>

<script>
import ColorSquare from 'components/ColorSquare';
import { createSquare } from 'src/utils/color';
import { optimizedKmeans } from 'src/utils/kmeans';
import { uid } from 'quasar';

export default {
  name: 'PageKmeansImage',

  components: { ColorSquare },

  data() {
    return {
      uid: uid(),
      k: 3,
      repreColors: [],

      size: 400,
      ctx: null,
      running: false,
    };
  },

  mounted() {
    this.$refs.image.crossOrigin = 'Anonymous';
  },

  methods: {
    replaceImage() {
      const [file] = this.$refs.fileInput.files;
      if (file) {
        this.$refs.image.src = URL.createObjectURL(file);
      }
      this.init();
    },

    init() {
      this.ctx = this.$refs.canvas.getContext('2d');
      this.ctx.drawImage(this.$refs.image, 0, 0);
    },

    getSquareColor(square) {
      return `rgb(${[square.r, square.g, square.b].join(',')})`;
    },
    run() {
      this.running = true;
      this.init();

      this.$nextTick(() => {
        const imageData = this.ctx.getImageData(0, 0, this.size, this.size);
        const imgData = imageData.data;
        const origDataset = [];

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          origDataset.push(createSquare(r, g, b));
        }

        console.log('Starting kmeans');
        const { clusters, dataset } = optimizedKmeans(this.k, origDataset, 3);
        const clusterColorMap = {};
        clusters.forEach((cluster) => {
          clusterColorMap[cluster.number] = cluster.color;
        });
        console.log({ clusterColorMap });

        this.repreColors = clusters.map(({ color }) => color);

        for (let i = 0; i < dataset.length; i++) {
          const { r, g, b } = clusterColorMap[dataset[i].clusterNumber];
          imageData.data[i * 4] = r;
          imageData.data[i * 4 + 1] = g;
          imageData.data[i * 4 + 2] = b;
        }

        this.ctx.putImageData(imageData, 0, 0);
        this.running = false;
      });
    },
  },
};
</script>

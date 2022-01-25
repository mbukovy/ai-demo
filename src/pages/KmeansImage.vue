<template>
  <q-page class="flex row">
    <div class="col-9 q-pa-sm">
      <div class="row">
        <div class="col">
          ORIGINAL <br>
          <img
            ref="image"
            :src="`https://random.imagecdn.app/${size}/${size}`"
            :style="{height: `${size}px`, width: `${size}px`}"
            @load="init"
          >
        </div>
        <div class="col">
          CANVAS <br>
          <canvas
            ref="canvas"
            :width="size"
            :height="size"
          />
        </div>
      </div>
      <div v-if="repreColors.length">
        Characteristic Colors
        <ColorSquare
          v-for="color in repreColors"
          :key="color.id"
          :color="getSquareColor(color)"
        />
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
    </div>
  </q-page>
</template>

<script>
import ColorSquare from 'components/ColorSquare';

export default {
  name: 'PageKmeansImage',

  components: { ColorSquare },

  data() {
    return {
      k: 3,
      repreColors: [],

      size: 400,
      ctx: null,
    };
  },

  methods: {
    init() {
      this.ctx = this.$refs.canvas.getContext('2d');
      this.ctx.drawImage(this.$refs.image, 0, 0);
    },

    getSquareColor(square) {
      return `rgb(${[square.r, square.g, square.b].join(',')})`;
    },

    run() {
      // get ctx pixels
      // get kmeans result
      // save repreColors
      // update ctx pixels with their repre color
    },
  },
};
</script>

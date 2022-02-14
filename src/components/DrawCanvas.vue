<template>
  <canvas
    id="drawCanvas"
    ref="canvas"
    :width="`${size}px`"
    :height="`${size}px`"
    @mousedown="startDrawing"
    @mousemove="draw($event)"
    @mouseup="drawing = false"
  />
</template>

<script>
const BRUSH_SIZE = 3;

export default {
  name: 'DrawCanvas',
  props: {
    size: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ctx: null,
      drawing: false,
    };
  },
  mounted() {
    this.$refs.canvas.height = this.size;
    this.$refs.canvas.width = this.size;
    this.ctx = this.$refs.canvas.getContext('2d');
    this.clear();
  },
  methods: {
    clear() {
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(0, 0, 500, 500);
    },
    getImageData() {
      return this.ctx.getImageData(0, 0, this.size, this.size);
    },
    startDrawing(e) {
      this.drawing = true;
      this.draw(e);
    },
    draw(e) {
      if (this.drawing) {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(
          e.offsetX - BRUSH_SIZE / 2,
          e.offsetY - BRUSH_SIZE / 2,
          BRUSH_SIZE,
          BRUSH_SIZE,
        );
      }
    },
  },
};
</script>

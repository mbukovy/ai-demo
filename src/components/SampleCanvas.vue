<script>
import { h } from 'vue';

export default {
  name: 'SampleCanvas',

  props: {
    sample: {
      type: Object,
      required: true,
    },
  },
  emits: ['render'],

  render() {
    const canvas = h('canvas', {
      ref: 'canvas',
      width: this.sample.width,
      height: this.sample.width,
      style: 'border: solid 1px #ddd',
    });

    this.$emit('render', {
      sample: this.sample,
      el: this,
    });
    return canvas;
  },
};
</script>

<template>
  <div
    class="q-ma-xs"
    :style="styles"
  >
    <q-tooltip>{{ title }}</q-tooltip>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ColorSquare',

  props: {
    color: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 32,
    },
    title: {
      type: String,
      default: null,
    },
  },

  setup(props) {
    const styles = computed(() => ({
      backgroundColor: props.color,
      width: `${props.size}px`,
      height: `${props.size}px`,
      border: 'solid 1px #ccc',
    }));

    return {
      styles,
    };
  },
});
</script>

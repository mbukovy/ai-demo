<template>
  <q-dialog
    :model-value="true"
    seamless
    position="bottom"
  >
    <q-card style="width: 350px">
      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">
            {{ generationTitle }}: {{ generation }}
          </div>
        </div>

        <q-space />

        <q-btn
          v-if="playing"
          flat
          round
          icon="stop"
          @click="$emit('stop')"
        >
          <q-tooltip>Stop simulation</q-tooltip>
        </q-btn>
        <q-btn
          v-else
          flat
          round
          icon="play_arrow"
          @click="$emit('play')"
        >
          <q-tooltip>Run simulation</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          icon="fast_forward"
          @click="$emit('step')"
        >
          <q-tooltip>Next step</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          icon="refresh"
          @click="$emit('restart')"
        >
          <q-tooltip>Restart</q-tooltip>
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ControlPanel',

  props: {
    generation: {
      type: Number,
      required: true,
    },
    playing: {
      type: Boolean,
      default: false,
    },
    generationTitle: {
      required: false,
      type: String,
      default: 'Generation',
    },
  },

  emits: ['play', 'stop', 'step', 'restart'],
});
</script>

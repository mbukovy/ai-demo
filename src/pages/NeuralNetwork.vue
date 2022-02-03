<template>
  <q-page class="flex row">
    <div class="col-9 q-pa-sm">
      <div class="row">
        <span v-if="inTraining">IN TRAINING</span>
        <br>
      </div>
      <div class="row">
        <div
          v-for="neuron in network.inputLayer"
          :key="neuron.id"
          class="col text-center bg-green-3 q-ma-lg"
        >
          <Neuron :neuron="neuron" />
        </div>
      </div>

      <div class="row">
        <div
          v-for="neuron in network.hiddenLayer"
          :key="neuron.id"
          class="col text-center bg-orange-3 q-ma-lg"
        >
          <Neuron :neuron="neuron" />
        </div>
      </div>

      <div class="row">
        <div
          v-for="neuron in network.outputLayer"
          :key="neuron.id"
          class="col text-center bg-blue-3 q-ma-lg"
        >
          <Neuron :neuron="neuron" />
        </div>
      </div>
    </div>

    <div class="col-3 q-pa-sm left-border">
      <q-btn
        round
        flat
        icon="refresh"
        @click="init(true)"
      />
      <q-color
        v-model="targetColor"
        class="my-picker"
      />
      <q-separator />
      <h5 class="text-grey">
        CONFIDENCE
        {{ network.outputLayer[0].output.toFixed(4) }}
      </h5>
    </div>

    <ControlPanel
      :generation="samplesTrained"
      generation-title="Samples trained"
      :playing="inTraining"
      @step="trainOne"
      @restart="trainImmediately"
      @play="startVisualTraining"
      @stop="inTraining = false"
    />
  </q-page>
</template>

<script>
import { createSquare, getDistancePerceptual, parseSquare } from 'src/utils/color';
import { Network } from 'src/utils/network';
import Neuron from 'components/Neuron';
import ControlPanel from 'components/ControlPanel';

const savedDataset = JSON.parse(
  localStorage.getItem('knn-dataset'),
);

export default {
  name: 'PageNN',
  components: { ControlPanel, Neuron },
  data() {
    return {
      dataset: [],
      samplesTrained: 0,
      inTraining: false,
      targetColor: 'rgb(255,0,0)',
      network: null,
    };
  },
  computed: {
    currentSample() {
      return savedDataset[(this.samplesTrained + 1) % savedDataset.length];
    },
  },

  watch: {
    targetColor(newValue) {
      if (!this.inTraining) {
        const sample = parseSquare(newValue);
        this.activate([sample.r / 255, sample.g / 255, sample.b / 255]);
      }
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.network = new Network(3, 3, 1);
      this.samplesTrained = 0;
    },

    trainOne() {
      const sample = this.currentSample;

      this.activate([sample.r / 255, sample.g / 255, sample.b / 255]);
      this.propagate([sample.tag === 'TRUE' ? 1 : 0]);
      this.samplesTrained += 1;

      return this.samplesTrained % 1000 !== 0;
    },
    propagate(target) {
      this.network.outputLayer.forEach((neuron, i) => neuron.propagate(target[i]));
      this.network.hiddenLayer.forEach((neuron) => neuron.propagate());
      return this.network.inputLayer.forEach((neuron) => neuron.propagate());
    },
    activate(input) {
      this.network.inputLayer.forEach((neuron, i) => neuron.activate(input[i]));
      this.network.hiddenLayer.forEach((neuron) => neuron.activate());
      return this.network.outputLayer.map((neuron) => neuron.activate());
    },
    startVisualTraining() {
      this.inTraining = true;
      this.playTraining();
    },
    playTraining() {
      setTimeout(() => {
        if (this.inTraining !== false && this.trainOne()) {
          this.playTraining();
        }
      }, 100);
    },
    trainImmediately() {
      this.inTraining = true;
      while (this.trainOne()) {
        /* empty */
      }
      this.inTraining = false;
    },
  },
};
</script>

<style scoped>
</style>

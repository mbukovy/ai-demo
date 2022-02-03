<template>
  <q-page class="flex row">
    <div class="col-9 q-pa-sm">
      <div
        v-for="(samples,digit) in datasetGroups"
        :key="digit"
        class="row"
      >
        <div
          v-for="sample in samples"
          :key="sample.uid"
        >
          <div
            class="q-ma-xs"
            @dblclick="removeSample(sample)"
          >
            <SampleCanvas
              :sample="sample"
              @render="sampleRendered"
            />
            <q-tooltip>{{ sample.digit }}</q-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="col-3 q-pa-sm left-border">
      <div class="row q-gutter-md q-pa-sm">
        <div class="col-12">
          <q-btn
            icon="clear"
            label="Clear"
            @click="clear"
          />
        </div>
        <div class="col-12">
          <DrawCanvas
            ref="drawCanvas"
            :size="100"
            style="border: solid 1px #ddd"
          />
        </div>
      </div>

      <q-separator />

      <div class="col-12">
        <q-select
          v-model="saveSampleAsValue"
          label="Save Sample As"
          :options="[0,1,2,3,4,5]"
        />
        <q-btn
          v-if="saveSampleAsValue !== null"
          label="Save Sample"
          class="full-width"
          @click="saveSample"
        />

        <q-separator class="q-my-lg" />

        <q-btn
          label="Run classification"
          @click="runClassification"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { Network } from 'src/utils/network';
import DrawCanvas from 'components/DrawCanvas';
import { groupBy } from 'lodash';
import { uid } from 'quasar';
import SampleCanvas from 'components/SampleCanvas';

const DATASET_NAME = 'digits-dataset';
const savedDataset = JSON.parse(
  localStorage.getItem(DATASET_NAME) || '[]',
);

export default {
  name: 'PageDigits',
  components: {
    SampleCanvas,
    DrawCanvas,
  },
  data() {
    return {
      dataset: savedDataset,
      samplesTrained: 0,
      trained: false,
      network: null,
      saveSampleAsValue: null,
      classificationResults: [],
    };
  },
  computed: {
    currentSample() {
      return this.dataset[(this.samplesTrained + 1) % this.dataset.length];
    },
    datasetGroups() {
      return groupBy(this.dataset, 'digit');
    },
  },

  mounted() {
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
    saveSample() {
      const imageData = this.$refs.drawCanvas.getImageData();
      const sample = {
        digit: this.saveSampleAsValue,
        uid: uid(),
        imageData: Array.from(imageData.data),
        width: imageData.width,
      };
      this.dataset.push(sample);
      this.storeDataset();
      this.clear();
    },
    storeDataset() {
      localStorage.setItem(DATASET_NAME, JSON.stringify(this.dataset));
    },
    clear() {
      this.$refs.drawCanvas.clear();
    },
    sampleRendered({ sample, el }) {
      this.$nextTick(() => {
        const ctx = el.$refs.canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, sample.width, sample.width);
        imageData.data.forEach((v, i) => {
          imageData.data[i] = sample.imageData[i];
        });
        el.$refs.canvas.getContext('2d').putImageData(imageData, 0, 0);
      });
    },
    removeSample(sample) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Like... really?!')) {
        this.dataset.splice(
          this.dataset.findIndex((s) => s.uid === sample.uid),
          1,
        );
        this.storeDataset();
      }
    },
    runClassification() {
      if (!this.trained) {
        console.log('training');
        this.trained = true;
      }
      console.log('classifying');
    },
  },
};
</script>

<style scoped>
</style>

<template>
  <q-page class="flex row">
    <div class="col-9 q-pa-sm">
      Groups: {{ datasetGroupsCount }}
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
            :size="SIZE"
            style="border: solid 1px #ddd"
          />
        </div>
      </div>

      <q-separator />

      <div class="col-12">
        <q-select
          v-model="saveSampleAsValue"
          label="Save Sample As"
          :options="[0,1,2,3,4,5,6,7,8,9]"
        />
        <q-btn
          v-if="saveSampleAsValue !== null"
          label="Save Sample"
          class="full-width"
          @click="saveSample"
        />

        <q-separator class="q-my-lg" />

        <div>
          Training cycles: {{ samplesTrained }}
        </div>

        <div class="row">
          <div class="col">
            <q-btn
              label="Run training"
              @click="trainImmediately"
            />
          </div>
          <div class="col">
            <q-input
              v-model="cyclesCount"
              type="number"
              suffix="cycles"
              size="xs"
              dense
              outlined
            />
          </div>
        </div>

        <q-separator class="q-my-sm" />

        <q-btn
          label="Run classification"
          color="primary"
          @click="classifyInput"
        />

        <q-separator class="q-my-sm" />

        <template v-if="network">
          <div
            v-for="(neuron,i) in network.outputLayer"
            :key="neuron.id"
            class="text-body1"
          >
            #{{ i }}: {{ neuron.output.toFixed(2) }}
            <br>
          </div>
        </template>
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

const getInputFromImageData = (imageData) => {
  const input = [];
  for (let i = 0; i < imageData.length; i += 4) {
    input.push(imageData[i] === 255 ? 0 : 1);
  }
  return input;
};

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
      cyclesCount: 2000,
      trained: false,
      network: null,
      saveSampleAsValue: null,
      classificationResults: [],
    };
  },
  computed: {
    SIZE() {
      return 20;
    },
    currentSample() {
      return this.samples[(this.samplesTrained + 1) % this.dataset.length];
    },
    datasetGroups() {
      return groupBy(this.dataset, 'digit');
    },
    datasetGroupsCount() {
      return Object.keys(this.datasetGroups).length;
    },
    samples() {
      return this.dataset.map((sample) => ({
        digit: sample.digit,
        input: getInputFromImageData(sample.imageData),
      }));
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.network = new Network(this.SIZE * this.SIZE, this.SIZE, this.datasetGroupsCount);
      console.log('network initialized');
      this.samplesTrained = 0;
    },
    trainOne() {
      const sample = this.currentSample;

      this.activate(sample.input);

      const sampleOutput = this.network.outputLayer.map(() => 0);
      sampleOutput[sample.digit] = 1;
      this.propagate(sampleOutput);

      this.samplesTrained += 1;
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
    trainImmediately() {
      setTimeout(() => {
        let i = 50;
        while (i--) {
          this.trainOne();
        }

        if (this.samplesTrained % this.cyclesCount !== 0) {
          this.trainImmediately();
        }
      }, 0);

      console.log('Last sample', this.samples[(this.samplesTrained) % this.dataset.length].digit);
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
      if (confirm('Delete it? Like... really?!')) {
        this.dataset.splice(
          this.dataset.findIndex((s) => s.uid === sample.uid),
          1,
        );
        this.storeDataset();
      }
    },
    classifyInput() {
      const imageData = Array.from(
        this.$refs.drawCanvas.getImageData().data,
      );
      this.activate(getInputFromImageData(imageData));
    },
  },
};
</script>

<style scoped>
</style>

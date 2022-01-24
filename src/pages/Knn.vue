<template>
  <q-page class="flex row">
    <div class="col-9 q-pa-sm">
      <div class="row">
        <div class="col-3 flex text-h6 align-items-center">
          Dataset {{ datasetSize }}
          <q-btn
            round
            flat
            icon="visibility"
            @click="previewDataset = true"
          />
        </div>
        <div class="col">
          <q-slider
            v-model="datasetSize"
            :min="50"
            :max="500"
            :step="5"
            @change="init(true)"
          />
        </div>
      </div>

      <hr>

      <div class="q-my-md row">
        <div class="col">
          <div class="text-center text-subtitle2">
            FALSE ({{ datasetFalse.length }})
          </div>
          <div class="flex">
            <ColorSquare
              v-for="(item) in datasetFalse"
              :key="item.id"
              :color="getSquareColor(item)"
              :title="`${item.tag}`"
              @click="tagItem(item)"
            />
          </div>
        </div>

        <q-separator vertical />

        <div class="col">
          <div class="text-center text-subtitle2">
            TRUE ({{ datasetTrue.length }})
          </div>
          <div class="flex">
            <ColorSquare
              v-for="(item) in datasetTrue"
              :key="item.id"
              :color="getSquareColor(item)"
              :title="`${item.tag}`"
              @click="tagItem(item)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-3 q-pa-sm">
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
        CLASSIFICATION RESULT
      </h5>
      <h5
        class="text-center"
        :class="{'bg-green text-white': resultTag === 'TRUE'}"
      >
        {{ resultTag }}
        <q-icon
          v-if="resultTag === 'TRUE'"
          name="check"
        />
      </h5>
    </div>

    <q-dialog v-model="previewDataset">
      <q-card style="width: 480px; max-width: 80vw;">
        <q-markup-table>
          <thead>
            <tr>
              <th />
              <th>R</th>
              <th>G</th>
              <th>B</th>
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in dataset"
              :key="item.id"
              class="text-center"
            >
              <td>
                <ColorSquare
                  :color="getSquareColor(item)"
                  :size="16"
                />
              </td>
              <td>{{ item.r }}</td>
              <td>{{ item.g }}</td>
              <td>{{ item.b }}</td>
              <td><b>{{ item.tag }}</b></td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import ColorSquare from 'components/ColorSquare';
import {
  createSquare, getDistancePerceptual, parseSquare, generateDataset,
} from 'src/utils/color';

export default {
  name: 'PageKnn',

  components: { ColorSquare },

  data() {
    return {
      datasetSize: 200,
      dataset: [],
      previewDataset: false,
      targetColor: 'rgb(255,0,0)',
      targetSquare: {},
      k: 3,
    };
  },
  computed: {
    datasetFalse() {
      return this.dataset.filter(({ tag }) => tag === 'FALSE');
    },
    datasetTrue() {
      return this.dataset.filter(({ tag }) => tag === 'TRUE');
    },
    resultTag() {
      const distances = this.dataset.map(
        (square) => ({
          tag: square.tag,
          distance: getDistancePerceptual(this.targetSquare, square),
        }),
      );

      distances.sort((a, b) => Math.sign(b.distance - a.distance));

      const counts = { TRUE: 0, FALSE: 0 };
      for (let i = 0; i < this.k; i += 1) {
        counts[distances[i].tag] += 1;
      }

      return counts.TRUE > counts.FALSE ? 'TRUE' : 'FALSE';
    },
  },

  watch: {
    targetColor(newValue) {
      this.targetSquare = {
        ...parseSquare(newValue),
        tag: 'N/A',
      };
    },
  },

  created() {
    this.targetSquare = createSquare(255, 0, 0, null, { tag: 'N/A' });
    this.init();
  },

  methods: {
    init(force = false) {
      const savedDataset = localStorage.getItem('knn-dataset');

      if (!force && savedDataset) {
        this.dataset = JSON.parse(savedDataset).map(
          (item) => createSquare(item.r, item.g, item.b, item.id, { tag: item.tag }),
        );
      } else {
        this.dataset = generateDataset(this.datasetSize);
      }
    },

    getSquareColor(square) {
      return `rgb(${[square.r, square.g, square.b].join(',')})`;
    },

    tagItem(item) {
      item.tag = item.tag === 'TRUE' ? 'FALSE' : 'TRUE';
      localStorage.setItem('knn-dataset', JSON.stringify(this.dataset));
    },
  },
};
</script>

<style scoped>
.align-items-center {
  align-items: center;
}
</style>

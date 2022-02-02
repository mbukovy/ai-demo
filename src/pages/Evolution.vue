<template>
  <q-page class="flex row q-py-lg">
    <div class="col-9 q-pa-sm">
      <div class="row">
        <div class="col-3 text-h6">
          <div>Population: {{ populationCount }}</div>
          <div>Generation: {{ generation }}</div>
        </div>
        <div class="col-6 q-px-sm">
          <q-slider
            v-model="populationCount"
            title="Population"
            :min="1"
            :max="400"
            :step="5"
            @change="init"
          />
        </div>
        <div class="col-3 q-px-sm">
          <q-slider
            v-model="mutationRate"
            title="Mutation Rate"
            label-always
            :min="0.01"
            :max="0.5"
            :step="0.01"
          />
        </div>
      </div>

      <div class="q-my-md row">
        <ColorSquare
          v-for="(individual) in population"
          :key="individual.id"
          :color="getSquareColor(individual)"
          :title="`${individual.fitness}`"
        />
      </div>

      <hr>

      <div class="row flex-center">
        <b>
          Best fit: {{ bestFitSquare.r }}, {{ bestFitSquare.g }}, {{ bestFitSquare.b }}
        </b>

        <ColorSquare
          :color="getSquareColor(bestFitSquare)"
        />
      </div>
    </div>

    <div class="col-3 q-pa-sm">
      <q-color
        v-model="targetColor"
        class="my-picker"
      />
    </div>

    <ControlPanel
      :generation="generation"
      :playing="playing"
      @step="evoluteOne"
      @restart="init"
      @play="playSimulation"
      @stop="playing = false"
    />
  </q-page>
</template>

<script>
import ControlPanel from 'components/ControlPanel';
import ColorSquare from 'components/ColorSquare';
import {
  createPopulation, getFitness, getNewGeneration, getRandomRgbComponent,
} from 'src/utils/evolution';
import { createSquare, parseSquare } from 'src/utils/color';

export default {
  name: 'PageEvolution',

  components: { ColorSquare, ControlPanel },

  data() {
    return {
      target: {},
      targetColor: 'rgb(255,0,0)',
      populationCount: 10,
      generation: 0,
      population: [],
      mutationRate: 0.01,
      playing: false,
      bestFitSquare: {},
      interval: null,
    };
  },

  watch: {
    targetColor(newValue) {
      this.target = {
        ...parseSquare(newValue),
        fitness: 0,
      };
    },
  },

  created() {
    this.target = createSquare(255, 0, 0, null, { fitness: 0 });
    this.init();
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },

  methods: {
    init() {
      this.population = createPopulation(this.populationCount);
      this.generation = 0;
    },

    evoluteOne() {
      this.population.forEach((square) => {
        square.fitness = getFitness(this.target, square);
      });

      this.population = getNewGeneration(this.population, this.mutationRate);

      this.population.forEach((square) => {
        square.fitness = getFitness(this.target, square);
      });

      const maxFitness = Math.max(...this.population.map(({ fitness }) => fitness));
      const maxIdx = this.population.findIndex(({ fitness }) => fitness === maxFitness);
      this.bestFitSquare = this.population[maxIdx];

      this.generation += 1;
    },

    playSimulation() {
      this.playing = true;
      this.interval = setInterval(() => {
        this.evoluteOne();

        if (this.playing === false) {
          clearInterval(this.interval);
        }
      }, 100);
    },

    getSquareColor(square) {
      return `rgb(${[square.r, square.g, square.b].join(',')})`;
    },
  },
};
</script>

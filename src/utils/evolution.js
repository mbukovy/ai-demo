import { createSquare, getDistancePerceptual } from 'src/utils/color';
import { getRandomArrayItem } from 'src/utils/helpers';

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

export function getRandomRgbComponent() {
  return Math.floor(Math.random() * 255);
}

export function getFitness(target, square) {
  return 1 - getDistancePerceptual(target, square);
}

export function createPopulation(count, target) {
  return Array.from(Array(count)).map(
    () => {
      const square = createSquare(
        getRandomRgbComponent(),
        getRandomRgbComponent(),
        getRandomRgbComponent(),
        null,
        { fitness: 0 },
      );
      square.fitness = getFitness(target, square);
      return square;
    },
  );
}

export function getMatingPool(population) {
  const matingPool = [];

  population.forEach((indiv) => {
    const n = Math.floor(indiv.fitness * 5);
    for (let i = 0; i < n; i += 1) {
      matingPool.push(indiv);
    }
  });

  return matingPool;
}

function crossover(mummy, daddy) {
  const r = Math.random() < 0.5 ? mummy.r : daddy.r;
  const g = Math.random() < 0.5 ? mummy.g : daddy.g;
  const b = Math.random() < 0.5 ? mummy.b : daddy.b;

  return createSquare(r, g, b, null, { fitness: 0 });
}

export function getNewGeneration(population, mutationRate = 0.1) {
  const matingPool = getMatingPool(population);
  return population.map(({ id }) => {
    // Mutation option 1
    // if (Math.random() < mutationRate) {
    //   return createSquare(
    //     getRandomRgbComponent(),
    //     getRandomRgbComponent(),
    //     getRandomRgbComponent(),
    //     id,
    //     { fitness: 0 },
    //   );
    // }

    const mummy = matingPool[getRandomIndex(matingPool)];
    const daddy = matingPool[getRandomIndex(matingPool)];
    const child = crossover(mummy, daddy);

    // Mutation option 2
    if (Math.random() < mutationRate) {
      const randomGene = getRandomArrayItem(['r', 'g', 'b']);
      child[randomGene] = Math.floor(Math.random() * 255);
    }

    return child;
  });
}

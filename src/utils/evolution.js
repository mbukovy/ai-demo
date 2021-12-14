import { createSquare, getFitnessPerceptual } from 'src/utils/color';

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

export function getRandomRgbComponent() {
  return Math.floor(Math.random() * 255);
}

export function rgbToHex(square) {
  return square.r.toString(16).padStart(2, '0')
    + square.g.toString(16).padStart(2, '0')
    + square.b.toString(16).padStart(2, '0');
}

export function createPopulation(count) {
  return Array.from(Array(count)).map(
    () => createSquare(
      getRandomRgbComponent(),
      getRandomRgbComponent(),
      getRandomRgbComponent(),
      null,
      { fitness: 0 },
    ),
  );
}

export function getFitness(target, square) {
  return getFitnessPerceptual(target, square);
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

function crossoverBad(mummy, daddy) {
  const r = (mummy.r + daddy.r) % 256;
  const g = (mummy.g + daddy.g) % 256;
  const b = (mummy.b + daddy.b) % 256;

  return createSquare(r, g, b, null, { fitness: 0 });
}

export function getNewGeneration(population, mutationRate = 0.1) {
  const matingPool = getMatingPool(population);
  return population.map(({ id }) => {
    if (Math.random() < mutationRate) {
      return createSquare(
        getRandomRgbComponent(),
        getRandomRgbComponent(),
        getRandomRgbComponent(),
        id,
        { fitness: 0 },
      );
    }

    const mummy = matingPool[getRandomIndex(matingPool)];
    const daddy = matingPool[getRandomIndex(matingPool)];

    return crossover(mummy, daddy);
  });
}

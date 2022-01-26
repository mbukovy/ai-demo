/* eslint-disable no-loop-func */

import { getRandomArrayItem } from 'src/utils/helpers';
import { getDistanceEuclidean } from 'src/utils/color';
import { uid } from 'quasar';

function getClusterNumber(targetColor, clusters) {
  let min = 9999;
  let clusterNumber = null;

  clusters.forEach(({ color, number }) => {
    const distance = getDistanceEuclidean(targetColor, color);
    if (distance < min) {
      min = distance;
      clusterNumber = number;
    }
  });

  return clusterNumber;
}

function getGeometricMeanColor(dataset) {
  return {
    r: dataset.reduce((sum, color) => sum + color.r, 0) / dataset.length,
    g: dataset.reduce((sum, color) => sum + color.g, 0) / dataset.length,
    b: dataset.reduce((sum, color) => sum + color.b, 0) / dataset.length,
  };
}

export function kmeans(k, originalDataset) {
  let clusters = [];

  let initPointsCount = k;
  // eslint-disable-next-line no-plusplus
  while (initPointsCount--) {
    clusters.push({
      color: getRandomArrayItem(originalDataset),
      clusterId: uid(),
      number: initPointsCount,
    });
  }

  console.log('kmeans: optimizing means');
  let distributionString = '0-0-0';
  while (true) {
    console.log('.');

    // assign dataset items into clusters
    originalDataset = originalDataset.map((targetColor) => ({
      ...targetColor,
      clusterNumber: getClusterNumber(targetColor, clusters),
    }));

    // remap dataset items into their cluster
    clusters = clusters.map((cluster) => ({
      ...cluster,
      dataset: originalDataset.filter(({ clusterNumber }) => clusterNumber === cluster.number),
    }));

    // recalculate clusters means
    clusters = clusters.map((cluster) => ({
      ...cluster,
      color: getGeometricMeanColor(cluster.dataset),
    }));

    // check if anything changed
    const newDistributionString = clusters.map(({ dataset }) => dataset.length).join('-');
    if (newDistributionString === distributionString) {
      break;
    }
    distributionString = newDistributionString;
  }

  return { clusters, dataset: originalDataset };
}

export function optimizedKmeans(k, dataset, iterations = 10) {
  let bestResult = [];
  let bestDistribution = dataset.length;

  while (iterations--) {
    console.log('optimizedKmeans: iteration', iterations);

    const result = kmeans(k, dataset);

    const distributionMean = result.clusters.reduce(
      (sum, cluster) => sum + Math.abs(cluster.dataset.length - dataset.length / k),
      0,
    ) / result.clusters.length;

    if (distributionMean < bestDistribution) {
      bestDistribution = distributionMean;
      bestResult = result;
    }
  }

  return bestResult;
}

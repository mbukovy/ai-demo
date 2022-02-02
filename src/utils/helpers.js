export function getRandomArrayIndex(items) {
  return Math.floor(Math.random() * items.length);
}

export function getRandomArrayItem(items) {
  return items[getRandomArrayIndex(items)];
}

import { createSquare } from 'src/utils/color';
import { getRandomRgbComponent } from 'src/utils/evolution';

export function generateDataset(count) {
  return Array.from(Array(count)).map(
    () => createSquare(
      getRandomRgbComponent(),
      getRandomRgbComponent(),
      getRandomRgbComponent(),
      null,
      { tag: 'FALSE' },
    ),
  );
}

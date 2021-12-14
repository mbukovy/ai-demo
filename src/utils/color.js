export function createSquare(r, g, b, id, additional = {}) {
  return {
    id: id || Math.random() * 100000,
    r,
    g,
    b,
    ...additional,
  };
}

export function getFitnessSimpleDiff(target, square) {
  const targetNum = (target.r * 256 * 256) + (target.b * 256) + target.b;
  const squareNum = (square.r * 256 * 256) + (square.b * 256) + square.b;
  const normalized = Math.abs(targetNum - squareNum) / 0xFFFFFF;
  return 1 - normalized;
}

export function getFitnessRgbComponents(target, square) {
  const componentFit = (a, b) => 1 - (Math.abs(a - b) / 255);

  return [
    componentFit(target.r, square.r),
    componentFit(target.g, square.g),
    componentFit(target.b, square.b),
  ].reduce((a, b) => a + b) / 3;
}

export function getFitnessPerceptual(target, square) {
  const rmean = (target.r + square.r) / 2;
  const r = target.r - square.r;
  const g = target.g - square.g;
  const b = target.b - square.b;
  const distance = Math.sqrt(
    (((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8),
  );
  return 1 - (distance / 765);
}

export function parseSquare(rgbString) {
  const rgb = rgbString.replace('rgb(', '').replace(')', '').split(',');

  return createSquare(
    parseInt(rgb[0], 10),
    parseInt(rgb[1], 10),
    parseInt(rgb[2], 10),
  );
}

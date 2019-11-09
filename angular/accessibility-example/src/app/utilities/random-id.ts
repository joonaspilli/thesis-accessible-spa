const perf = performance;

export const randomId = (count: number = 1, radix: number = 36): string =>
  [...Array(count)]
    .map(() => Math.random())
    .concat(perf.now())
    .map((e: number) => e.toString(radix).slice(2))
    .join('')
    .replace('.', '');

export const createWebWorker = (worker: unknown): Worker => {
  const code = worker?.toString();
  const blob = new Blob([
    `
   self.importScripts('https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js');
   (${code})();
   `,
  ]);
  return new Worker(URL.createObjectURL(blob));
};

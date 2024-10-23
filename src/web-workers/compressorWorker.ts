interface ICompressWorkerRequest {
  file: File;
  options: { maxWidthOrHeight: number; maxSizeMB: number };
}

export default () => {
  self.addEventListener(
    "message",
    async (event: MessageEvent<ICompressWorkerRequest>) => {
      const { file, options } = event.data;
      try {
        const compressedFile = await (self as any).imageCompression(
          file,
          options,
        );
        return postMessage({ compressedFile });
      } catch (error) {
        return postMessage({ error });
      }
    },
  );
};

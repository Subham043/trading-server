export interface MultipartFile {
  name: string;
  data: ArrayBuffer | Buffer | NodeJS.ArrayBufferView;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: false;
  mimetype: string;
  md5: string;
  mv(path: string): Promise<void>;
}

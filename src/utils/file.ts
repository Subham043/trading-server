import { MultipartFile } from "../@types/multipart_file.type";
import path from "path";
import fs from "fs";

export const saveImage: (file: MultipartFile) => Promise<string> = async (
  file
) => {
  const extension = file.mimetype.split("/")[1];
  const fileName = file.md5 + "." + extension;
  const filePath = path.resolve(__dirname, `../../static/images/${fileName}`);
  file.mv(filePath);
  return fileName;
};

export const deleteImage: (fileName: string) => void = async (fileName) => {
  const filePath = path.resolve(__dirname, `../../static/images/${fileName}`);
  fs.unlinkSync(filePath);
};

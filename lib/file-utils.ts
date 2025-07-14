import fs from "fs/promises";

// save Image into 'public' folder and return the name of saved file.
export async function saveImage(file: File): Promise<string> {
  const image = await file.arrayBuffer();
  const filename = `/${file.name}_${Date.now().toString()}`;
  await fs.appendFile(`./public${filename}`, Buffer.from(image));
  return filename;
}

// delete Image from 'publid' folder
export function deleteImage(filename: string) {
  fs.rm(`./public${filename}`);
}

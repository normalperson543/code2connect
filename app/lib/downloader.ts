import JSZip from "jszip";
import type { Files, FileInfo } from "./files";
import saveAs from "file-saver";

export default function download(files: Files, filename: string) {
  const iterableFiles = Object.entries(files);
  const zip = new JSZip();
  iterableFiles.map((file) => {
    const fileInfo: FileInfo = file[1] as FileInfo;
    zip.file(file[1].name, file[1].contents)
  });
  zip.generateAsync({type:"blob"})
  .then(function(content) {
      // see FileSaver.js
      saveAs(content, `${filename}.zip`);
  });
}
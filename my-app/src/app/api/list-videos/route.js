// app/api/list-videos/route.js
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { createExtractorFromData } from "node-unrar-js";

const videoExtensions = /\.(mp4|mkv|avi|mov)$/i;

const scanFolder = (folderPath) => {
 const items = fs.readdirSync(folderPath, { withFileTypes: true });
 const episodes = [];

 items.forEach((item, idx) => {
  const fullPath = path.join(folderPath, item.name);

  if (item.isDirectory()) {
   // Rekursif subfolder
   episodes.push(...scanFolder(fullPath));
  } else if (videoExtensions.test(item.name)) {
   episodes.push(`Episode ${idx + 1} - ${item.name}`);
  } else if (/\.zip$/i.test(item.name)) {
   const zip = new AdmZip(fullPath);
   zip.getEntries().forEach((entry, entryIdx) => {
    if (videoExtensions.test(entry.entryName)) {
     episodes.push(`${item.name} - Episode ${entryIdx + 1} - ${entry.entryName}`);
    }
   });
  } else if (/\.rar$/i.test(item.name)) {
   const data = fs.readFileSync(fullPath);
   const extractor = createExtractorFromData({ data });
   const list = extractor.getFileList();
   list.fileHeaders.forEach((fh, fhIdx) => {
    if (videoExtensions.test(fh.name)) {
     episodes.push(`${item.name} - Episode ${fhIdx + 1} - ${fh.name}`);
    }
   });
  }
 });

 return episodes;
};

export async function POST(req) {
 const body = await req.json(); // [{ Path, SubFolders: [...] }]
 const result = [];

 body.forEach((row) => {
  row.SubFolders.forEach((sub) => {
   const fullPath = path.join(row.Path, sub);
   try {
    const episodes = scanFolder(fullPath);
    result.push({ folder: sub, episodes });
   } catch (err) {
    console.error(`Error scanning folder ${fullPath}:`, err);
   }
  });
 });

 return new Response(JSON.stringify(result), {
  headers: { "Content-Type": "application/json" },
 });
}

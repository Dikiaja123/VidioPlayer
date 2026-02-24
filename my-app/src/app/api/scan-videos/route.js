// app/api/scan-videos/route.js
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { createExtractorFromData } from "node-unrar-js"; // Perubahan di sini

const videoExtensions = /\.(mp4|mkv|avi|mov)$/i;

// Ubah menjadi async function
const scanFolder = async (folderPath) => {
 const items = fs.readdirSync(folderPath, { withFileTypes: true });
 const videos = [];

 for (const item of items) {
  const fullPath = path.join(folderPath, item.name);

  if (item.isDirectory()) {
   const subFolderVideos = await scanFolder(fullPath);
   videos.push(...subFolderVideos);
  } else if (videoExtensions.test(item.name)) {
   videos.push({ type: "file", path: fullPath, name: item.name });
  } else if (/\.zip$/i.test(item.name)) {
   const zip = new AdmZip(fullPath);
   zip.getEntries().forEach((entry) => {
    if (videoExtensions.test(entry.entryName)) {
     videos.push({ type: "zip", zipPath: fullPath, file: entry.entryName });
    }
   });
  } else if (/\.rar$/i.test(item.name)) {
   try {
    const data = fs.readFileSync(fullPath);
    // Cara baru menggunakan node-unrar-js v2+
    const extractor = await createExtractorFromData({ data });
    const list = extractor.getFileList();

    // ArcHeader.files berisi daftar file
    for (const fileHeader of list.fileHeaders) {
     if (videoExtensions.test(fileHeader.name)) {
      videos.push({ type: "rar", rarPath: fullPath, file: fileHeader.name });
     }
    }
   } catch (err) {
    console.error(`Error reading RAR ${fullPath}:`, err);
   }
  }
 }

 return videos;
};

export async function POST(req) {
 const body = await req.json();
 const result = [];

 // Gunakan for...of agar bisa menggunakan await di dalamnya
 for (const row of body) {
  for (const sub of row.SubFolders) {
   const fullPath = path.join(row.Path, sub);
   try {
    const videos = await scanFolder(fullPath);
    result.push({ folder: sub, videos });
   } catch (err) {
    console.error(`Error scanning folder ${fullPath}:`, err);
   }
  }
 }

 return new Response(JSON.stringify(result), {
  headers: { "Content-Type": "application/json" },
 });
}

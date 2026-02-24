import fs from "fs";
import { NextResponse } from "next/server";

export async function GET(req) {
 const { searchParams } = new URL(req.url);
 const filePath = searchParams.get("path");

 if (!filePath || !fs.existsSync(filePath)) {
  return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
 }

 const stat = fs.statSync(filePath);
 const fileSize = stat.size;
 const range = req.headers.get("range");

 // Logika untuk mendukung 'Seeking' (lompat durasi) di video player
 if (range) {
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunksize = end - start + 1;
  const file = fs.createReadStream(filePath, { start, end });

  return new Response(file, {
   status: 206,
   headers: {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "video/mp4", // atau video/x-matroska untuk mkv
   },
  });
 } else {
  const file = fs.createReadStream(filePath);
  return new Response(file, {
   status: 200,
   headers: {
    "Content-Length": fileSize,
    "Content-Type": "video/mp4",
   },
  });
 }
}

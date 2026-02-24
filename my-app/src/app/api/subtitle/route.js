import { execSync } from "child_process";
import fs from "fs";

export async function GET(req) {
 const { searchParams } = new URL(req.url);
 const videoPath = searchParams.get("path");

 if (!videoPath || !fs.existsSync(videoPath)) {
  return new Response("Video tidak ditemukan", { status: 404 });
 }

 try {
  // Ganti 'C:\\ffmpeg.exe' dengan lokasi folder tempat Anda menyimpan ffmpeg.exe tadi
  const ffmpegPath = `D:\\Pribadi\\0. Project\\1. Harus Jadi Apapun\\Youtube\\ffmpeg-2026-02-15-git-33b215d155-full_build\\ffmpeg-2026-02-15-git-33b215d155-full_build\\bin\\ffmpeg.exe`;

  const subtitleData = execSync(`"${ffmpegPath}" -i "${videoPath}" -map 0:s:0 -f webvtt pipe:1`, { stdio: ["pipe", "pipe", "ignore"] });

  return new Response(subtitleData, {
   headers: { "Content-Type": "text/vtt" },
  });
 } catch (error) {
  return new Response("Subtitle tidak ditemukan", { status: 404 });
 }
}

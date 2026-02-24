"use client";
// 1. Tambahkan useRouter ke dalam list import
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAnimeData } from "@/utils";

const PageAnimeDetail = () => {
 const searchParams = useSearchParams();
 const folderId = searchParams.get("id");

 // 2. Inisialisasi router di sini
 const router = useRouter();

 const [folder, setFolder] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (folderId) {
   fetchAnimeData().then((allData) => {
    const found = allData.find((item) => String(item.ID) === folderId);
    setFolder(found);
    setLoading(false);
   });
  }
 }, [folderId]);

 if (loading) return <div className="p-10 text-center font-semibold">Loading Episode...</div>;
 if (!folder) return <div className="p-10 text-center">Anime tidak ditemukan.</div>;

 return (
  <div className="min-h-screen bg-gray-50 p-6">
   <div className="max-w-5xl mx-auto">
    {/* Header Section */}
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
     <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">{folder.FolderName}</h1>
     <p className="text-gray-500 text-sm mt-1">Path: {folder.Location}</p>
    </div>

    {/* List Video */}
    <div className="grid gap-4">
     {folder.Videos?.map((video) => (
      <div
       key={video.ID}
       className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 transition-all group cursor-pointer shadow-sm">
       <div className="flex flex-col">
        <span className="text-[10px] font-bold text-indigo-500 uppercase">{video.GroupingVideo}</span>
        <span className="text-gray-700 font-medium group-hover:text-indigo-700 transition-colors">{video.VideoName}</span>
       </div>

       <button
        onClick={() => {
         const fullPath = `${folder.Location}\\${folder.FolderName}\\${video.GroupingVideo}\\${video.VideoName}`;
         router.push(`/play-video?path=${encodeURIComponent(fullPath)}&id=${folder.ID}`);
        }}
        className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
        PLAY
       </button>
      </div>
     ))}
    </div>

    {folder.Videos?.length === 0 && <p className="text-center text-gray-400 py-10 italic">Belum ada video untuk folder ini.</p>}
   </div>
  </div>
 );
};

export default PageAnimeDetail;

"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAnimeData } from "@/utils";

const PagePlayVideo = () => {
 const searchParams = useSearchParams();
 const router = useRouter();

 const currentPath = searchParams.get("path");
 const folderId = searchParams.get("id");

 const [folderData, setFolderData] = useState(null);
 const [playlist, setPlaylist] = useState([]);
 const [recommendations, setRecommendations] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isPlaylistOpen, setIsPlaylistOpen] = useState(true); // State buka/tutup

 useEffect(() => {
  if (folderId) {
   fetchAnimeData().then((allData) => {
    // 1. Ambil data folder saat ini
    const foundFolder = allData.find((f) => String(f.ID) === folderId);
    if (foundFolder) {
     setFolderData(foundFolder);
     setPlaylist(foundFolder.Videos || []);
    }

    const otherAnimes = allData.filter((f) => String(f.ID) !== folderId);
    const shuffled = [...otherAnimes].sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, 5));

    setLoading(false);
   });
  }
 }, [folderId]);

 const playNext = (video) => {
  if (!folderData) return;
  const newPath = `${folderData.Location}\\${folderData.FolderName}\\${video.GroupingVideo}\\${video.VideoName}`;
  router.push(`/play-video?path=${encodeURIComponent(newPath)}&id=${folderId}`);
 };

 if (loading) return <div className="bg-black text-white h-screen flex items-center justify-center italic">Loading Player...</div>;

 return (
  <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
   {/* Header */}
   <div className="p-4 bg-zinc-900 flex items-center justify-between border-b border-zinc-800 z-10">
    <div className="flex items-center gap-4">
     <button
      onClick={() => router.push("/")}
      className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
      🏠 Home
     </button>
     <button
      onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
      className="bg-zinc-800 px-3 py-1 rounded text-xs hover:bg-zinc-700 transition-colors">
      {isPlaylistOpen ? "✕ Tutup Sidebar" : "☰ Buka Sidebar"}
     </button>
    </div>
    <div className="text-[10px] text-zinc-500 truncate max-w-xs md:max-w-xl italic">{currentPath?.split("\\").pop()}</div>
   </div>

   <div className="flex flex-1 overflow-hidden relative">
    <div className="flex-1 bg-black flex items-center justify-center transition-all duration-300">
     <video
      key={currentPath}
      controls
      autoPlay
      className="w-full h-full"
      src={`/api/video?path=${encodeURIComponent(currentPath)}`}>
      <track
       label="Indonesia"
       kind="subtitles"
       srcLang="id"
       src={`/api/subtitle?path=${encodeURIComponent(currentPath)}`}
       default
      />
     </video>
    </div>

    <div
     className={`bg-zinc-900 border-l border-zinc-800 flex flex-col transition-all duration-300 shadow-2xl
            ${isPlaylistOpen ? "w-80 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
     {/* TAB PLAYLIST */}
     <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
       <h2 className="font-bold text-xs uppercase tracking-widest text-indigo-400">Daftar Episode</h2>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
       {playlist.map((video, idx) => {
        const isPlaying = currentPath && currentPath.includes(video.VideoName);
        return (
         <div
          key={video.ID || idx}
          onClick={() => playNext(video)}
          className={`p-3 border-b border-zinc-800/50 cursor-pointer transition-all flex flex-col
                      ${isPlaying ? "bg-indigo-600/20 border-l-4 border-l-indigo-500" : "hover:bg-zinc-800"}`}>
          <span className={`text-[11px] font-medium truncate ${isPlaying ? "text-white" : "text-gray-400"}`}>{video.VideoName}</span>
          <span className="text-[9px] text-zinc-600 uppercase mt-1">{video.GroupingVideo}</span>
         </div>
        );
       })}
      </div>
     </div>

     <div className="h-2/5 border-t border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
      <div className="p-3 bg-zinc-900/50 border-b border-zinc-800">
       <h2 className="font-bold text-[10px] uppercase tracking-widest text-emerald-400 font-mono">Rekomendasi Untukmu</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
       {recommendations.map((anime) => (
        <div
         key={anime.ID}
         onClick={() => router.push(`/anime-detail?id=${anime.ID}`)}
         className="flex gap-2 p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 cursor-pointer border border-transparent hover:border-zinc-700 transition-all group">
         <div className="w-12 h-16 bg-zinc-800 rounded flex-shrink-0 overflow-hidden">
          <img
           src="https://via.placeholder.com/50x70?text=?"
           className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
         </div>
         <div className="flex flex-col justify-center min-w-0">
          <h3 className="text-[10px] font-bold text-gray-200 truncate uppercase">{anime.FolderName}</h3>
          <span className="text-[8px] text-gray-500 mt-1">{anime.Videos?.length || 0} Episodes</span>
         </div>
        </div>
       ))}
      </div>
     </div>
    </div>
   </div>

   <style jsx>{`
    video::cue {
     background: rgba(0, 0, 0, 0.7);
     color: white;
     font-size: 18px;
    }
    .custom-scrollbar::-webkit-scrollbar {
     width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
     background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
     background: #333;
     border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
     background: #444;
    }
   `}</style>
  </div>
 );
};

export default PagePlayVideo;

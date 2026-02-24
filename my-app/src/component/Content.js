"use client";
import React, { useEffect, useState } from "react";
import { fetchAnimeData } from "@/utils";
import { useRouter } from "next/navigation";

const Content = () => {
 const router = useRouter();
 const [data, setData] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchAnimeData()
   .then((res) => setData(res))
   .catch((err) => console.error(err))
   .finally(() => setLoading(false));
 }, []);

 const handleCardClick = (folder) => {
  router.push(`/anime-detail?id=${folder.ID}`);
 };

 if (loading) return <div className="p-4 text-center">Memuat koleksi anime...</div>;

 return (
  <div className="p-6 bg-gray-100 min-h-screen w-full">
   <div className="mx-auto">
    <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b-4 border-indigo-500 inline-block">Koleksi Anime</h1>
    <div className="flex flex-wrap gap-6 justify-center sm:justify-start items-stretch">
     {data.map((folder) => (
      <div
       key={folder.ID}
       onClick={() => handleCardClick(folder)}
       className="flex flex-col w-full sm:w-64 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 group">
       <div className="relative h-44 bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
         src="https://via.placeholder.com/300x200?text=No+Cover"
         alt={folder.FolderName}
         className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md font-bold">{folder.Videos?.length || 0} EPS</span>
       </div>

       <div className="p-4 flex flex-col grow">
        <h2 className="text-gray-800 font-bold text-md line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors mb-1">{folder.FolderName}</h2>
       </div>
      </div>
     ))}
    </div>
    {data.length === 0 && (
     <div className="text-center py-20 text-gray-400">
      <p>Data Excel tidak ditemukan.</p>
     </div>
    )}
   </div>
  </div>
 );
};

export default Content;

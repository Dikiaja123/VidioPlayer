export const fetchFolders = async (folders) => {
 if (!folders || folders.length === 0) return [];

 const res = await fetch("/api/read-folders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ folders }),
 });

 if (!res.ok) {
  const text = await res.text();
  console.error("Error response:", text);
  return [];
 }

 return res.json();
};

export const fetchVideos = async (folderData) => {
 const res = await fetch("/api/scan-videos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(folderData),
 });
 if (!res.ok) throw new Error("API scan-videos error");
 return res.json();
};

export const fetchAnimeData = async () => {
 const res = await fetch("/api/list-anime", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
 });

 if (!res.ok) {
  const errorData = await res.json();
  throw new Error(errorData.error || "Gagal mengambil data dari Excel");
 }

 return res.json();
};

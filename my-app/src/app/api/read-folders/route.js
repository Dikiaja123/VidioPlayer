import fs from "fs";

export async function POST(req) {
 try {
  const { folders } = await req.json();

  const result = folders.map((item) => {
   try {
    const subFolders = fs
     .readdirSync(item.Path, { withFileTypes: true })
     .filter((dirent) => dirent.isDirectory())
     .map((dirent) => dirent.name);

    return { ID: item.ID, Path: item.Path, SubFolders: subFolders };
   } catch (err) {
    return { ID: item.ID, Path: item.Path, error: err.message };
   }
  });

  return new Response(JSON.stringify(result), {
   status: 200,
   headers: { "Content-Type": "application/json" },
  });
 } catch (err) {
  return new Response(JSON.stringify({ error: err.message }), {
   status: 500,
   headers: { "Content-Type": "application/json" },
  });
 }
}

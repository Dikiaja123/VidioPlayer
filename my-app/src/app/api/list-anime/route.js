import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export async function GET() {
 try {
  const filePath = path.join(process.cwd(), "src/data/DataPath.xlsx");
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  // Membaca Sheet menjadi JSON (Baris 1 otomatis jadi Field)
  const paths = XLSX.utils.sheet_to_json(workbook.Sheets["Path"]);
  const folders = XLSX.utils.sheet_to_json(workbook.Sheets["Folder"]);
  const videos = XLSX.utils.sheet_to_json(workbook.Sheets["Video"]);

  // Menyatukan data (Join)
  const result = folders.map((f) => ({
   ...f,
   Location: paths.find((p) => p.ID === f.FK_Path)?.Path || "",
   Videos: videos.filter((v) => v.FK_Folder === f.ID),
  }));

  return new Response(JSON.stringify(result), { status: 200 });
 } catch (err) {
  return new Response(JSON.stringify({ error: err.message }), { status: 500 });
 }
}

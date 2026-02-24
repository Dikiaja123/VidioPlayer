import * as XLSX from "xlsx";

export const ReadExcel = (buffer) => {
 try {
  const wb = XLSX.read(buffer, { type: "array" }); // type array untuk arrayBuffer
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const data = XLSX.utils.sheet_to_json(ws);
  return data;
 } catch (err) {
  console.error("Error membaca Excel:", err);
  return [];
 }
};

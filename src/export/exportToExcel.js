import * as XLSX from "xlsx";

export default function exportToExcel(data, filename) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  const downloadExcelFile = (content, fileName) => {
    const blob = new Blob([content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  downloadExcelFile(wbout, filename);
}

// Example usage:
// const dataList = [
//   { id: 1, name: 'John', age: 30 },
//   { id: 2, name: 'Jane', age: 25 },
//   { id: 3, name: 'Doe', age: 40 },
// ];

// function App() {
//   return (
//     <div>
//       <button
//         onClick={() =>
//           exportToExcel(dataList, 'example.xlsx')
//         }
//       >
//         Export to Excel
//       </button>
//     </div>
//   );
// }

// import {
//     AlignmentType, Document, HeadingLevel,
//     Packer, Paragraph, TextRun, UnderlineType,
//     Table, TableCell, TableRow,
//     TableLayoutType,
//     WidthType,
//     ImageRun,
//     Packer
// } from 'docx';

// import { saveAs } from "file-saver";
// // import HeadLogo from '../assets/logo.jpg'

// function getTableHeadRow() {
//     const cols = ["Order#", "Branch", "Sales", "Client", "Amount", "Deposit", "Tax Opt.", "Balance", "Date"];

//     const row = cols.map(c => (new TableCell({
//         width: { size: Math.floor(100 / cols.length), type: WidthType.PERCENTAGE },
//         children: [new Paragraph(c)],
//     })));

//     return new TableRow({
//         children: row
//     });
// }

// function getDataRows(data) {
//     const rows = [];
//     const fields = ["id", "branch", "sales", "client", "amount", "deposit", "taxOpt", "balance", "created"];
//     let index = 1;

//     data.forEach(d => {
//         const row = [
//             new TableCell({
//                 width: { size: 1, type: WidthType.PERCENTAGE }, // Math.floor(100 / fields.length)
//                 children: [new Paragraph(`${index}`)],
//             }),
//         ];

//         fields.forEach(field => {
//             if (field === "branch") {
//                 row.push(new TableCell({
//                     width: { size: 1, type: WidthType.PERCENTAGE },
//                     children: [new Paragraph(`${d.branch.name}`)],
//                 }))
//             } else if (field === "sales" || field === "client") {
//                 row.push(new TableCell({
//                     width: { size: 1, type: WidthType.PERCENTAGE },
//                     children: [new Paragraph(`${d[field].username}`)],
//                 }))
//             } else if (field === "amount" || field === "deposit" || field === "balance") {
//                 row.push(new TableCell({
//                     width: { size: 1, type: WidthType.PERCENTAGE },
//                     children: [new Paragraph(`${d[field].toFixed(2)}`)],
//                 }))
//             }else {
//                 row.push(new TableCell({
//                     width: { size: 1, type: WidthType.PERCENTAGE },
//                     children: [new Paragraph(`${d[field] ? d[field] : ""}`)],
//                 }))
//             }
//         })

//         rows.push(new TableRow({
//             children: row
//         }));

//         index++;
//     })
//     return rows;
// }

// export function getOrderTable(rows) {
//     const dataRows = getDataRows(rows);
//     const head = getTableHeadRow();
//     const r1 = [
//         { label: "#", size: 5 },
//         { label: "Zone", size: 10 },
//         { label: "Floor", size: 10 },
//         { label: "Room", size: 10 },
//         { label: "Location", size: 10 },
//         { label: "Type", size: 10 },
//         { label: "Panels", size: 5 },
//         { label: "Louver", size: 10 },
//         { label: "Tilt", size: 10 },
//         { label: "Frame", size: 10 },
//         { label: "IN/OUT", size: 5 },
//         { label: "W", size: 15 },
//         { label: "H", size: 15 },
//         { label: "Area", size: 15 },
//         { label: "Price", size: 20 },
//     ];

//     return new Table({
//         rows: [
//             // new TableRow({
//             //     children: r1.map(it => new TableCell({
//             //         children: [new Paragraph({
//             //             children: [
//             //                 new TextRun({
//             //                     text: it.label,
//             //                     bold: true,
//             //                 }),
//             //             ],
//             //         })],
//             //         width: { size: it.size, type: WidthType.PERCENTAGE }
//             //     }))
//             // }),
//             head,
//             ...dataRows,
//         ]
//     });
// }

// export async function getOrdersDocument(orders) {
//     const t2 = getOrderTable(orders);

//     return new Document({
//         sections: [{
//             width: {
//                 size: 11200,
//                 type: WidthType.DXA,
//             },
//             children: [
//                 t2,
//             ],
//         }],
//     });
// }

// export function downloadOrders(orders, onComplete){
//     getOrdersDocument(orders).then(doc => {
//         Packer.toBlob(doc).then(blob => {
//             saveAs(blob, `${BrandName}-orders-${(new Date()).toISOString()}.docx`);
//             if(onComplete){
//                 onComplete();
//             }
//         });
//     });
// }

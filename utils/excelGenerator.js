import ExcelJS from 'exceljs';

/**
 * Helper: parse buffer Excel ke array of JSON object (kompatibel format sheet_to_json)
 * @param {Buffer} buffer - Buffer file excel
 * @returns {Promise<Array<Object>>}
 */
export const readExcelBuffer = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const rows = [];
  let headers = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      headers = row.values.slice(1).map(h => (h !== undefined && h !== null ? String(h).trim() : ''));
    } else {
      const rowData = {};
      let hasData = false;
      headers.forEach((header, index) => {
        if (!header) return;
        const cellValue = row.getCell(index + 1).value;
        let value = cellValue;
        // Unwrap formula atau richText jika ada
        if (cellValue && typeof cellValue === 'object') {
          if (cellValue.result !== undefined) {
            value = cellValue.result;
          } else if (cellValue.richText) {
            value = cellValue.richText.map(t => t.text).join('');
          } else if (cellValue.text !== undefined) {
            value = cellValue.text;
          }
        }
        if (value !== undefined && value !== null && value !== '') {
          hasData = true;
        }
        rowData[header] = value !== undefined && value !== null ? value : null;
      });
      if (hasData) {
        rows.push(rowData);
      }
    }
  });

  return rows;
};

/**
 * Generates an Excel buffer from a given JSON dataset.
 * 
 * @param {Array<Object>} data - The dataset to convert to Excel
 * @param {String} sheetName - Name of the worksheet
 * @returns {Promise<Buffer>} - The generated Excel file buffer
 */
export const generateExcelBuffer = async (data, sheetName = 'Report') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  if (!data || data.length === 0) {
    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  // Ambil keys dari record pertama sebagai kolom
  const headers = Object.keys(data[0]);
  worksheet.columns = headers.map(header => ({
    header,
    key: header,
    width: Math.max(header.length + 4, 15)
  }));

  // Style header row
  worksheet.getRow(1).font = { bold: true };

  // Tambahkan rows
  data.forEach(item => {
    worksheet.addRow(item);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

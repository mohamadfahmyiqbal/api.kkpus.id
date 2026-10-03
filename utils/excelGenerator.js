import * as xlsx from 'xlsx';

/**
 * Generates an Excel buffer from a given JSON dataset.
 * 
 * @param {Array<Object>} data - The dataset to convert to Excel
 * @param {String} sheetName - Name of the worksheet
 * @returns {Buffer} - The generated Excel file buffer
 */
export const generateExcelBuffer = (data, sheetName = 'Report') => {
  // Convert JSON to worksheet
  const worksheet = xlsx.utils.json_to_sheet(data);
  
  // Create a new workbook and append the worksheet
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Write the workbook to a buffer
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  return buffer;
};

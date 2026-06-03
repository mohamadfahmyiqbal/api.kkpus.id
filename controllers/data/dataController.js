import db from "../../models/index.js";
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { Op } from "sequelize";

const { Member, Billing, Accounts, BillItems, FinancingApplication } = db;

/**
 * Export members data to Excel/CSV
 */
export const exportMembers = async (req, res) => {
  try {
    const { format = 'xlsx' } = req.query;
    
    const members = await Member.findAll({
      attributes: [
        'member_no', 'full_name', 'email', 'phone_number', 
        'nik_ktp', 'gender', 'address', 'member_type', 
        'status_id', 'join_date', 'created_at'
      ],
      order: [['created_at', 'DESC']]
    });

    // Transform data for export
    const exportData = members.map(member => ({
      'No. Anggota': member.member_no,
      'Nama Lengkap': member.full_name,
      'Email': member.email,
      'No. Telepon': member.phone_number,
      'NIK KTP': member.nik_ktp,
      'Jenis Kelamin': member.gender,
      'Alamat': member.address,
      'Tipe Anggota': member.member_type,
      'Status ID': member.status_id,
      'Tanggal Bergabung': member.join_date,
      'Tanggal Dibuat': member.created_at
    }));

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Anggota');

    // Generate file
    const fileName = `members_export_${new Date().toISOString().split('T')[0]}.${format}`;
    const filePath = path.join(process.cwd(), 'temp', fileName);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    XLSX.writeFile(wb, filePath);

    // Send file
    res.setHeader('Content-Type', format === 'csv' 
      ? 'text/csv' 
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Clean up file after send
    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });

  } catch (error) {
    console.error('Export Members Error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengekspor data anggota'
    });
  }
};

/**
 * Export transactions data to Excel
 */
export const exportTransactions = async (req, res) => {
  try {
    const { format = 'xlsx', startDate, endDate } = req.query;
    
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.due_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const transactions = await BillItems.findAll({
      where: whereClause,
      include: [
        {
          model: Member,
          attributes: ['member_no', 'full_name']
        }
      ],
      order: [['due_date', 'DESC']]
    });

    const exportData = transactions.map(tx => ({
      'ID Transaksi': tx.bill_id,
      'No. Anggota': tx.Member?.member_no || '',
      'Nama Anggota': tx.Member?.full_name || '',
      'Jenis Tagihan': tx.bill_type,
      'Deskripsi': tx.description,
      'Jumlah': tx.amount,
      'Tanggal Jatuh Tempo': tx.due_date,
      'Status': tx.status,
      'Tanggal Dibuat': tx.created_at
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Transaksi');

    const fileName = `transactions_export_${new Date().toISOString().split('T')[0]}.${format}`;
    const filePath = path.join(process.cwd(), 'temp', fileName);
    
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    XLSX.writeFile(wb, filePath);

    res.setHeader('Content-Type', format === 'csv' 
      ? 'text/csv' 
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });

  } catch (error) {
    console.error('Export Transactions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengekspor data transaksi'
    });
  }
};

/**
 * Export financial reports to Excel
 */
export const exportFinancialReports = async (req, res) => {
  try {
    const { format = 'xlsx', period = 'monthly' } = req.query;
    
    let dateFormat, startDate;
    const now = new Date();
    
    switch (period) {
      case 'yearly':
        dateFormat = '%Y';
        startDate = new Date(now.getFullYear() - 5, 0, 1);
        break;
      case 'monthly':
      default:
        dateFormat = '%Y-%m';
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
    }

    const financialData = await BillItems.findAll({
      attributes: [
        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('due_date'), dateFormat), 'period'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN bill_type = "SETORAN" THEN amount ELSE 0 END')), 'total_deposits'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN bill_type = "PENARIKAN" THEN amount ELSE 0 END')), 'total_withdrawals'],
        [db.sequelize.fn('COUNT', db.sequelize.col('bill_item_id')), 'transaction_count']
      ],
      where: {
        due_date: { [Op.gte]: startDate }
      },
      group: [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('due_date'), dateFormat)],
      order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('due_date'), dateFormat), 'ASC']]
    });

    const exportData = financialData.map(item => ({
      'Periode': item.dataValues.period,
      'Total Setoran': item.dataValues.total_deposits || 0,
      'Total Penarikan': item.dataValues.total_withdrawals || 0,
      'Netto': (item.dataValues.total_deposits || 0) - (item.dataValues.total_withdrawals || 0),
      'Jumlah Transaksi': item.dataValues.transaction_count
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');

    const fileName = `financial_report_${new Date().toISOString().split('T')[0]}.${format}`;
    const filePath = path.join(process.cwd(), 'temp', fileName);
    
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    XLSX.writeFile(wb, filePath);

    res.setHeader('Content-Type', format === 'csv' 
      ? 'text/csv' 
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });

  } catch (error) {
    console.error('Export Financial Error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengekspor laporan keuangan'
    });
  }
};

/**
 * Import members data from Excel file
 */
export const importMembers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const [index, row] of data.entries()) {
      try {
        await Member.create({
          member_no: row['No. Anggota'] || `AUTO${Date.now()}${index}`,
          full_name: row['Nama Lengkap'],
          email: row['Email'],
          phone_number: row['No. Telepon'],
          nik_ktp: row['NIK KTP'],
          gender: row['Jenis Kelamin'],
          address: row['Alamat'],
          member_type: row['Tipe Anggota'] || 'Calon Anggota',
          status_id: parseInt(row['Status ID']) || 1,
          join_date: row['Tanggal Bergabung'] ? new Date(row['Tanggal Bergabung']) : new Date()
        });
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Baris ${index + 2}: ${error.message}`);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: `Import selesai. ${successCount} berhasil, ${errorCount} gagal.`,
      data: {
        successCount,
        errorCount,
        errors: errors.slice(0, 10) // Limit error display
      }
    });

  } catch (error) {
    console.error('Import Members Error:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengimpor data anggota'
    });
  }
};

/**
 * Import transactions data from Excel file
 */
export const importTransactions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const [index, row] of data.entries()) {
      try {
        // Find member by member_no or name
        const member = await Member.findOne({
          where: {
            [Op.or]: [
              { member_no: row['No. Anggota'] },
              { full_name: row['Nama Anggota'] }
            ]
          }
        });

        if (!member) {
          throw new Error('Anggota tidak ditemukan');
        }

        await BillItems.create({
          bill_id: row['ID Transaksi'] || `TX${Date.now()}${index}`,
          member_id: member.member_id,
          bill_type: row['Jenis Tagihan'],
          description: row['Deskripsi'],
          amount: parseFloat(row['Jumlah']),
          due_date: row['Tanggal Jatuh Tempo'] ? new Date(row['Tanggal Jatuh Tempo']) : new Date(),
          status: row['Status'] || 'PENDING'
        });
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Baris ${index + 2}: ${error.message}`);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: `Import selesai. ${successCount} berhasil, ${errorCount} gagal.`,
      data: {
        successCount,
        errorCount,
        errors: errors.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Import Transactions Error:', error);
    
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengimpor data transaksi'
    });
  }
};

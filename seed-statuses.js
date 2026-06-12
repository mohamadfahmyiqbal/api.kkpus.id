import db from './models/index.js';
import { v4 as uuidv4 } from 'uuid';

async function seedStatuses() {
  try {
    console.log('Fetching existing flows...');
    const flows = await db.ApprovalFlow.findAll();
    
    if (!flows.length) {
      console.log('No flows found. Run seed-data.js first.');
      process.exit(1);
    }

    const statusesToInsert = [];
    
    for (const flow of flows) {
      // Create statuses for each flow
      const statuses = [
        { status_code: 'WAITING_APPROVAL', status_name: 'Menunggu Persetujuan' },
        { status_code: 'APPROVED', status_name: 'Disetujui' },
        { status_code: 'REJECTED', status_name: 'Ditolak' }
      ];
      
      for (const s of statuses) {
        // Check if already exists to prevent duplicate
        const existing = await db.ApprovalStatus.findOne({
          where: { approval_flow_id: flow.approval_flow_id, status_code: s.status_code }
        });
        
        if (!existing) {
          statusesToInsert.push({
            approval_status_id: uuidv4(),
            approval_flow_id: flow.approval_flow_id,
            status_code: s.status_code,
            status_name: s.status_name,
            is_active: 1
          });
        }
      }
    }

    if (statusesToInsert.length > 0) {
      console.log(`Inserting ${statusesToInsert.length} statuses...`);
      await db.ApprovalStatus.bulkCreate(statusesToInsert);
      console.log('Statuses inserted.');
    } else {
      console.log('Statuses already exist.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed seeding statuses:', error);
    process.exit(1);
  }
}

seedStatuses();

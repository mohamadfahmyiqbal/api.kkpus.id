// 📁 src/utils/approval/getApprovalData.js (Modul Fleksibel)

import db from "../../../models/index.js";

/**
 * Mengambil data entitas dan validasi flow/step yang sedang berjalan.
 * @param {string} entityRef - Referensi tabel (e.g., 'MEMBER_REGISTRATION').
 * @param {number} entityId - ID entitas (e.g., registrationId).
 * @param {number} currentStepId - ID langkah persetujuan yang diharapkan.
 * @param {object} t - Objek transaksi Sequelize.
 * @returns {Promise<{entity: object, approvalFlowId: number}>}
 */
export const getApprovalData = async (entityRef, entityId, currentStepId, t) => {
    
    const ApprovalFlow = db.ApprovalFlow;
    
    // 1. Cari Approval Flow berdasarkan entityRef dan entityId
    const flow = await ApprovalFlow.findOne({
        where: {
            entity_ref: entityRef,
            entity_id: entityId, // Cari flow yang terikat ke ID entitas spesifik
        },
        transaction: t,
    });

    if (!flow) {
        throw new Error(`Approval Flow tidak ditemukan untuk ${entityRef} ID: ${entityId}`);
    }

    // 2. Tentukan Model Entitas yang akan diambil
    let EntityModel;
    switch (entityRef) {
        case 'MEMBER_REGISTRATION':
            EntityModel = db.MemberRegistration;
            break;
        case 'FINANCING_APPLICATION':
            EntityModel = db.FinancingApplication;
            break;
        case 'SAVINGS_WITHDRAWAL':
            EntityModel = db.SavingsWithdrawal;
            break;
        default:
            throw new Error(`Entitas ${entityRef} tidak didukung.`);
    }

    // 3. Ambil Entitas dan Validasi Step
    const entity = await EntityModel.findByPk(entityId, { transaction: t });

    if (!entity) {
        throw new Error(`Data entitas ${entityRef} ID ${entityId} tidak ditemukan.`);
    }

    // VALIDASI: Pastikan entitas ada di langkah yang benar
    if (entity.current_step_id !== currentStepId || entity.final_status !== 'PENDING') {
        throw new Error(`Entitas tidak berada di langkah persetujuan yang benar (Step ${currentStepId}) atau sudah diproses.`);
    }
    
    return { entity, approvalFlowId: flow.approval_flow_id };
};
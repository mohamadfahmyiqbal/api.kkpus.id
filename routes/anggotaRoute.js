import express from "express";
import multer from "multer";
import { getAnggotaProfile } from "../controllers/core/anggota/getAnggotaProfile.js";
import { updateAnggotaProfile } from "../controllers/core/anggota/updateAnggotaProfile.js";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { submitRegistration } from "../controllers/core/anggota/submitRegistration.js";
import { getRegistrationStatus } from "../controllers/core/anggota/getRegistrationStatus.js";
import {
  submitTermination,
  getTerminationStatus,
} from "../controllers/core/anggota/submitTermination.js";
import { getAllMembers } from "../controllers/core/anggota/getAllMembers.js";
import { confirmTermination } from "../controllers/core/anggota/confirmTermination.js";
import { importAnggota } from "../controllers/core/anggota/importAnggota.js";
import { downloadTemplateAnggota } from "../controllers/core/anggota/downloadTemplateAnggota.js";
import { updateRole } from "../controllers/core/anggota/updateRole.js";
import { getRoles } from "../controllers/core/anggota/getRoles.js";
import { deleteMember, deleteBatchMembers } from "../controllers/core/anggota/deleteMember.js";
import MidRole from "../middleware/MidRole.js";

const router = express.Router();
const upload = multer();

const BACKOFFICE_ROLES = ["Admin", "Super Admin", "Ketua", "Bendahara", "Pengawas", "admin"];
const ADMIN_MANAGE_ROLES = ["Admin", "Super Admin", "Ketua", "admin"];

router.get("/profil", MidAnggota, getAnggotaProfile);
router.put("/profil", MidAnggota, updateAnggotaProfile);
router.post("/pendaftaran", MidAnggota, submitRegistration);
router.get("/getRegistrationStatus", MidAnggota, getRegistrationStatus);
router.post("/berhenti-keanggotaan", MidAnggota, submitTermination);
router.get("/berhenti-keanggotaan/status", MidAnggota, getTerminationStatus);
router.post("/berhenti-keanggotaan/konfirmasi", MidAnggota, confirmTermination);

// API untuk Backoffice
router.get("/all", MidAnggota, MidRole(BACKOFFICE_ROLES), getAllMembers);
router.get("/template-import", MidAnggota, MidRole(ADMIN_MANAGE_ROLES), downloadTemplateAnggota);
router.post("/import", MidAnggota, upload.single("file"), MidRole(ADMIN_MANAGE_ROLES), importAnggota);
router.put("/:member_id/role", MidAnggota, MidRole(ADMIN_MANAGE_ROLES), updateRole);
router.get("/roles", MidAnggota, MidRole(BACKOFFICE_ROLES), getRoles);
router.post("/batch-delete", MidAnggota, MidRole(ADMIN_MANAGE_ROLES), deleteBatchMembers);
router.delete("/:member_id", MidAnggota, MidRole(ADMIN_MANAGE_ROLES), deleteMember);

export default router;

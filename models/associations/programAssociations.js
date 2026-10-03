// models/associations/programAssociations.js
export default function defineProgramAssociations(db) {
  // Arisan Associations
  db.ArisanProgram.hasMany(db.ArisanBatch, {
    foreignKey: "arisan_program_id",
    as: "batches",
  });
  db.ArisanBatch.belongsTo(db.ArisanProgram, {
    foreignKey: "arisan_program_id",
    as: "program",
  });

  db.ArisanBatch.hasMany(db.ArisanParticipant, {
    foreignKey: "arisan_batch_id",
    as: "participants",
  });
  db.ArisanParticipant.belongsTo(db.ArisanBatch, {
    foreignKey: "arisan_batch_id",
    as: "batch",
  });

  db.Member.hasMany(db.ArisanParticipant, {
    foreignKey: "member_id",
    as: "arisan_participations",
  });
  db.ArisanParticipant.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  // Arisan Payments
  db.ArisanBatch.hasMany(db.ArisanPayment, {
    foreignKey: "arisan_batch_id",
    as: "payments",
  });
  db.ArisanPayment.belongsTo(db.ArisanBatch, {
    foreignKey: "arisan_batch_id",
    as: "batch",
  });
  db.Member.hasMany(db.ArisanPayment, {
    foreignKey: "member_id",
    as: "arisan_payments",
  });
  db.ArisanPayment.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  // Arisan Draws
  db.ArisanBatch.hasMany(db.ArisanDraw, {
    foreignKey: "arisan_batch_id",
    as: "draws",
  });
  db.ArisanDraw.belongsTo(db.ArisanBatch, {
    foreignKey: "arisan_batch_id",
    as: "batch",
  });
  db.Member.hasMany(db.ArisanDraw, {
    foreignKey: "winner_member_id",
    as: "arisan_draws_won",
  });
  db.ArisanDraw.belongsTo(db.Member, {
    foreignKey: "winner_member_id",
    as: "winner",
  });

  // Sukuk Associations
  db.SukukOrder.belongsTo(db.SukukIssue, {
    foreignKey: "sukuk_issue_id",
    as: "issue",
  });
  db.SukukIssue.hasMany(db.SukukOrder, {
    foreignKey: "sukuk_issue_id",
    as: "orders",
  });
  db.SukukOrder.belongsTo(db.SukukIssue, {
    foreignKey: "sukuk_issue_id",
    as: "sukukIssue",
  });
  db.SukukOrder.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });
  db.Member.hasMany(db.SukukOrder, {
    foreignKey: "member_id",
    as: "sukukOrders",
  });

  // Training / Curriculum Associations
  db.Curriculum.hasMany(db.Material, {
    foreignKey: "curriculum_id",
    as: "materials",
  });
  db.Material.belongsTo(db.Curriculum, {
    foreignKey: "curriculum_id",
    as: "curriculum",
  });

  db.Material.hasMany(db.Evaluation, {
    foreignKey: "material_id",
    as: "evaluations",
  });
  db.Evaluation.belongsTo(db.Material, {
    foreignKey: "material_id",
    as: "material",
  });

  db.Member.hasMany(db.Evaluation, {
    foreignKey: "member_id",
    as: "evaluations",
  });
  db.Evaluation.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.Material.hasMany(db.MaterialNote, {
    foreignKey: "material_id",
    as: "notes",
  });
  db.MaterialNote.belongsTo(db.Material, {
    foreignKey: "material_id",
    as: "material",
  });

  db.Member.hasMany(db.MaterialNote, {
    foreignKey: "member_id",
    as: "notes",
  });
  db.MaterialNote.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.Member.hasOne(db.Ranking, {
    foreignKey: "member_id",
    as: "trainingRanking",
  });
  db.Ranking.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });
}

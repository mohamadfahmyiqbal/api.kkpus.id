import db from "../../models/index.js";

const { ArisanParticipant, Member, ArisanBatch } = db;

export const getParticipantsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    const participants = await ArisanParticipant.findAll({
      where: { arisan_batch_id: batchId },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['member_id', 'member_no', 'full_name', 'phone_number']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: participants
    });
  } catch (error) {
    console.error("Error getParticipantsByBatch:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateParticipantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const participant = await ArisanParticipant.findByPk(id);
    if (!participant) {
      return res.status(404).json({ success: false, message: "Participant not found" });
    }

    participant.status = status;
    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: participant
    });
  } catch (error) {
    console.error("Error updateParticipantStatus:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateParticipantNo = async (req, res) => {
  try {
    const { id } = req.params;
    const { participant_no } = req.body;

    const participant = await ArisanParticipant.findByPk(id);
    if (!participant) {
      return res.status(404).json({ success: false, message: "Participant not found" });
    }

    participant.participant_no = parseInt(participant_no);
    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Nomor peserta diupdate",
      data: participant
    });
  } catch (error) {
    console.error("Error updateParticipantNo:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

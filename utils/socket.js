import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import fs from "fs";

let io = null;
const users = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "https://kkpus.id",
        "https://admin.kkpus.id",
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.setMaxListeners(50);

  io.on("connection", (socket) => {
    console.log(`🔌 New Connection: ${socket.id}`);

    socket.on("heartbeat", () => {
      socket.emit("heartbeat:ack", { timestamp: new Date().getTime() });
    });

    socket.on("register", (memberId) => {
      if (!memberId) return;
      
      const idStr = String(memberId).toLowerCase();
      if (!users.has(idStr)) {
        users.set(idStr, new Set());
      }
      users.get(idStr).add(socket.id);
      
      try { fs.appendFileSync('socket.log', `--- SOCKET REGISTER ---\nMember: ${idStr}\nSocket ID: ${socket.id}\n`); } catch(e) {}
      
      console.log("--- SOCKET REGISTER ---");
      console.log(`👤 Member: ${idStr}`);
      console.log(`🆔 Socket ID: ${socket.id}`);
      console.log(`📊 Total Users Online: ${users.size}`);
      console.log("-----------------------");
    });

    socket.on("profile:request", async () => {
      const token = socket.handshake.auth?.token;
      
      if (!token) return;

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        const memberId = decoded.member_id;

        const userData = await db.Member.findByPk(memberId, {
          attributes: ["member_id", "full_name", "email", "phone_number", "status_id", "member_type"],
          include: [
            {
              model: db.MemberBankAccount,
              as: "bankAccounts",
              attributes: ["bank_name", "bank_account_no", "account_holder"],
              limit: 1,
            },
            {
              model: db.Account,
              as: "account",
              attributes: ["current_balance", "account_id"],
            }
          ]
        });

        const profileData = userData ? userData.toJSON({ plain: true }) : {};
        const bankAccount = profileData.bankAccounts?.[0];
        
        const responseData = {
          member_id: profileData.member_id,
          full_name: profileData.full_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          status_id: profileData.status_id,
          member_type: profileData.member_type,
          bank_info: bankAccount ? { 
            bank_name: bankAccount.bank_name, 
            bank_account_no: bankAccount.bank_account_no, 
            account_holder: bankAccount.account_holder 
          } : null,
          balance: profileData.account?.current_balance ? parseFloat(profileData.account.current_balance) : 0,
          account_id: profileData.account?.account_id || null,
        };
        
        socket.emit("profile:update", responseData);

      } catch (error) {
        console.error("Profile request error:", error.message);
        socket.emit("auth:fail");
      }
    });

    socket.on("withdrawals:request", async (data) => {
      const { category } = data;
      const token = socket.handshake.auth?.token;
      
      if (!token) return;

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        const memberId = decoded.member_id;

        if (category.startsWith('TAB_DEP_')) {
          const tabunganId = category.replace('TAB_DEP_', '');
          const withdrawals = await db.SavingsWithdrawal.findAll({
            where: { member_saving_target_id: tabunganId, member_id: memberId },
            attributes: ['withdrawal_id', 'member_saving_target_id', 'member_id', 'amount', 'method', 'bank_name', 'bank_account_no', 'request_datetime', 'status', 'approval_flow_id', 'current_step_id', 'invoice_id', 'midtrans_transaction_id', 'created_at', 'updated_at'],
            order: [['created_at', 'DESC']]
          });
          
          socket.emit("withdrawals:update", {
            category,
            withdrawals: withdrawals.map(w => w.toJSON()),
            balance: 0
          });
          return;
        }

        // Find savings product
        const product = await db.SavingsProduct.findOne({
          where: { product_code: category }
        });

        if (!product) {
          socket.emit("withdrawals:update", { category, withdrawals: [], balance: 0 });
          return;
        }

        // Find member's savings account
        const account = await db.MemberSavingsAccount.findOne({
          where: { member_id: memberId, savings_product_id: product.savings_product_id }
        });

        const balance = account ? parseFloat(account.current_balance || 0) : 0;

        // Find withdrawals
        const withdrawals = account ? await db.SavingsWithdrawal.findAll({
          where: { savings_account_id: account.savings_account_id },
          attributes: ['withdrawal_id', 'savings_account_id', 'member_id', 'amount', 'method', 'bank_name', 'bank_account_no', 'request_datetime', 'status', 'approval_flow_id', 'current_step_id', 'invoice_id', 'midtrans_transaction_id', 'created_at', 'updated_at'],
          order: [['created_at', 'DESC']]
        }) : [];

        socket.emit("withdrawals:update", { 
          category, 
          withdrawals: withdrawals.map(w => w.toJSON()), 
          balance 
        });

      } catch (error) {
        console.error("Withdrawals request error:", error);
      }
    });

    socket.on("TRANSACTION_UPDATED", (data) => {
      console.log("📊 Client Transaction Update:", data);
    });

    socket.on("disconnect", () => {
      socket.removeAllListeners();
      for (const [memberId, socketSet] of users.entries()) {
        if (socketSet.has(socket.id)) {
          socketSet.delete(socket.id);
          if (socketSet.size === 0) {
            users.delete(memberId);
          }
          console.log(`❌ Socket ${socket.id} for Member ${memberId} terputus (Total Users Online: ${users.size})`);
          break;
        }
      }
    });
  });

  global.io = io;
  
  return io;
};

export const sendToUser = (memberId, event, data) => {
  if (!io) {
    console.warn("⚠️ [SOCKET] Gagal kirim: IO belum diinisialisasi");
    return false;
  }

  const targetId = String(memberId).toLowerCase();
  const socketSet = users.get(targetId);

  const logMsg = `[SOCKET DEBUG] Attempting to send event '${event}' to Member: ${targetId}. Online users: ${Array.from(users.keys()).join(', ')}\n`;
  try { fs.appendFileSync('socket.log', logMsg); } catch(e) {}

  if (socketSet && socketSet.size > 0) {
    socketSet.forEach(socketId => {
      try { fs.appendFileSync('socket.log', `[SOCKET DEBUG] Sending event '${event}' to Socket ID: ${socketId}\n`); } catch(e) {}
      io.to(socketId).emit(event, data);
    });
    return true;
  } else {
    try { fs.appendFileSync('socket.log', `[SOCKET DEBUG] Failed to send: Member ${targetId} is NOT online.\n`); } catch(e) {}
    console.warn(`[SOCKET DEBUG] Failed to send: Member ${targetId} is NOT online or has no active sockets.`);
    return false;
  }
};

export { users };
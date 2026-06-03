import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "naila";

async function main() {
  // 1. Generate token
  const payload = {
    member_id: "2ba91920-7731-4fee-8b51-afe996cf91bd",
    email: "testSatu@test.com",
    role: "MEMBER"
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  console.log("Generated JWT Token:", token);

  // 2. Call endpoint
  try {
    const url = "https://localhost:3445/api/billing/invoice/details";
    const data = {
      bill_item_ids: [216],
      bill_id: null
    };
    
    // Ignore SSL certificate errors
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      httpsAgent: agent
    });

    console.log("=== HTTP SUCCESS ===");
    console.log("Status:", response.status);
    console.log("Response data:", JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.log("=== HTTP FAILURE ===");
    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Response data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

main();

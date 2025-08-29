import { exec } from "child_process";
import path from "path";

const pm2Path = "~/nodevenv/api.kkpus.id/20/lib/bin/pm2"; // Ubah sesuai lokasi pm2 kamu
const appPath = path.resolve("./pus.js");

exec(`${pm2Path} start ${appPath} --name myapp`, (error, stdout, stderr) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  if (stderr) console.error("stderr:", stderr);
  console.log("stdout:", stdout);
});

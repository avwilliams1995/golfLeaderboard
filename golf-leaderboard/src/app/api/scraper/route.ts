import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function GET() {
  const pythonScriptPath = path.resolve("./scripts/golfScraper.py");

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [pythonScriptPath]);

    let dataString = "";

    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      reject(new Error(`Python script error: ${data.toString()}`));
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        reject(new Error(`Python process exited with code ${code}`));
      } else {
        try {
          const result = JSON.parse(dataString);
          resolve(NextResponse.json(result));
        } catch (err) {
          console.error(`Error parsing JSON: ${err}`);
          reject(new Error(`Error parsing JSON: ${err}`));
        }
      }
    });
  });
}

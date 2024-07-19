import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function GET(request: NextRequest) {
  console.log("GET request received");
  const scriptPath = path.resolve("scripts/golfScraper.py");
  console.log(`Script path: ${scriptPath}`);

  const pythonProcess = spawn("python3", [scriptPath]);

  return new Promise((resolve, reject) => {
    let result = "";

    pythonProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        try {
          const parsedResult = JSON.parse(result);
          resolve(new Response(JSON.stringify(parsedResult), { status: 200 }));
        } catch (err) {
          console.error(`Error parsing JSON: ${err}`);
          reject(new Error(`Error parsing JSON: ${err}`));
        }
      }
    });
  });
}

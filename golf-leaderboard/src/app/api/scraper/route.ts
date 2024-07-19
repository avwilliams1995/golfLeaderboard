import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function GET(request: NextRequest): Promise<void | NextResponse> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.resolve(
      process.cwd(),
      "scripts",
      "golfScraper.py"
    );
    const pythonProcess = spawn("python3", [pythonScriptPath]);

    let dataString = "";

    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pythonProcess.stdout.on("end", () => {
      try {
        const result = JSON.parse(dataString);
        resolve(NextResponse.json(result));
      } catch (err) {
        reject(new Error(`Error parsing JSON: ${err}`));
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      reject(new Error(`Error in fetchData controller: ${data.toString()}`));
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
}

// src/app/api/scraper/route.ts
import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function GET() {
  const pythonScriptPath = path.join(
    process.cwd(),
    "scripts",
    "golfScraper.py"
  );
//   console.log(`Python script path: ${pythonScriptPath}`);

  const pythonProcess = spawn("python3", [pythonScriptPath]);

  let dataString = "";
  let errorString = "";

  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    //   console.log(`stdout: ${data.toString()}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      errorString += data.toString();
    //   console.error(`stderr: ${data.toString()}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        // console.error(`Python process exited with code ${code}`);
        reject(NextResponse.json({ error: errorString }, { status: 500 }));
      } else {
        // console.log(`Received data: ${dataString}`); // Log the data received from the Python script
        try {
          const result = JSON.parse(dataString);
          resolve(NextResponse.json(result));
        } catch (err) {
          console.error(`Error parsing JSON: error`);
          reject(
            NextResponse.json(
              { error: `Error parsing JSON: ` },
              { status: 500 }
            )
          );
        }
      }
    });
  });
}

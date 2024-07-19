import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function GET(request: NextRequest) {
  const scriptPath = path.resolve("scripts/golfScraper.py");
  console.log(`Executing Python script at path: ${scriptPath}`);

  // Log Python version
  const pythonVersionProcess = spawn("python3", ["--version"]);
  pythonVersionProcess.stdout.on("data", (data) => {
    console.log(`Python version: ${data}`);
  });

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
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        try {
          console.log(`Python script result: ${result}`);
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

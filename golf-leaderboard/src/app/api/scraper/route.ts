import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function GET(request: NextRequest): Promise<Response> {
  const scriptPath = path.resolve("scripts/golfScraper.py");
  const pythonProcess = spawn("python3", [scriptPath]);

  return new Promise((resolve, reject) => {
    let result = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        reject(
          new Response(
            JSON.stringify({ error: `Python script exited with code ${code}` }),
            { status: 500 }
          )
        );
      } else {
        try {
          const parsedResult = JSON.parse(result);
          resolve(new Response(JSON.stringify(parsedResult), { status: 200 }));
        } catch (err) {
          console.error(`Error parsing JSON: ${err}`);
          reject(
            new Response(
              JSON.stringify({ error: `Error parsing JSON: ${err}` }),
              { status: 500 }
            )
          );
        }
      }
    });
  });
}

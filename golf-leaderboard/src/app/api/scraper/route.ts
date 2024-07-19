import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET(): Promise<void | NextResponse> {
  return new Promise((resolve) => {
    const pythonScriptPath = path.join(
      process.cwd(),
      "scripts",
      "golfScraper.py"
    );

    exec(`python3 ${pythonScriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return resolve(
          new NextResponse(`Error executing Python script: ${error.message}`, {
            status: 500,
          })
        );
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        return resolve(
          new NextResponse(`Python script stderr: ${stderr}`, { status: 500 })
        );
      }

      try {
        const data = JSON.parse(stdout);
        return resolve(new NextResponse(JSON.stringify(data), { status: 200 }));
      } catch (jsonError) {
        console.error(
          `Error parsing JSON from Python script: `
        );
        return resolve(
          new NextResponse(
            `Error parsing JSON from Python script: `,
            { status: 500 }
          )
        );
      }
    });
  });
}

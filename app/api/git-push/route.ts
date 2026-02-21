import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function POST() {
  const projectRoot = process.cwd();

  return new Promise((resolve) => {
    // 1. We add the 'safe.directory' command to the start of the chain
    // 2. We then try to add, commit, and push
    const command = `git config --global --add safe.directory ${projectRoot} && git add . && git commit -m "Dev Sync: ${new Date().toISOString()}" && git push origin main 2>&1`;

    exec(command, { 
      cwd: projectRoot,
      env: { ...process.env, HOME: '/root' } 
    }, (err, stdout) => {
      const output = stdout || "No output";
      
      // If there's nothing to commit, Git returns an error code, 
      // but we want to treat that as a 'soft' success in the UI. A comment test
      const isClean = output.includes("nothing to commit") || output.includes("up-to-date");
      const success = !err || isClean;

      return resolve(NextResponse.json({ 
        success, 
        terminalOutput: output 
      }));
    });
  });
}
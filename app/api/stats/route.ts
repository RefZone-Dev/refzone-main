export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET() {
  // 1. Calculate Resources
  const cpus = os.cpus();
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b);
    return acc + (1 - cpu.times.idle / total);
  }, 0) / cpus.length;
  const ramUsage = ((os.totalmem() - os.freemem()) / os.totalmem()) * 100;

  // 2. Get Last File Change (Local)
  let lastFileChange = "Unknown";
  try {
    const projectRoot = process.cwd();
    // We look at the stats of the current directory
    const stats = fs.statSync(projectRoot);
    lastFileChange = new Date(stats.mtime).toLocaleTimeString('en-AU', {
      hour12: false,
      timeZone: 'Australia/Sydney'
    });
  } catch (e) {
    lastFileChange = "Error";
  }

  return NextResponse.json({
    cpu: Math.round(cpuUsage * 100),
    ram: Math.round(ramUsage),
    lastChange: lastFileChange
  });
}
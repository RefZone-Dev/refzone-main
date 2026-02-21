export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  const cpus = os.cpus();
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b);
    return acc + (1 - cpu.times.idle / total);
  }, 0) / cpus.length;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const ramUsage = ((totalMem - freeMem) / totalMem) * 100;

  return NextResponse.json({
    cpu: Math.round(cpuUsage * 100),
    ram: Math.round(ramUsage)
  });
}
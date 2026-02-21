'use client';
import { useState, useEffect } from 'react';

export default function DevToolbar() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [stats, setStats] = useState({ cpu: 0, ram: 0, lastChange: '---' });
  const [isPushing, setIsPushing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!window.location.hostname.includes('preview.dev')) return;
    setIsVisible(true);

    // Live Clock
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-AU', { 
        hour12: false, 
        timeZone: 'Australia/Sydney' 
      }));
    }, 1000);

    // Fetch stats every 3 seconds for snappier feedback on file saves
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) { console.error("Stats sync error"); }
    };
    
    fetchStats();
    const statsTimer = setInterval(fetchStats, 3000);

    return () => { clearInterval(timer); clearInterval(statsTimer); };
  }, []);

  const handlePush = async () => {
    setIsPushing(true);
    try {
      const res = await fetch('/api/git-push', { method: 'POST' });
      const result = await res.json();
      if (res.ok && result.success) alert("🚀 GitHub Synced!");
      else alert("❌ Sync Failed");
    } catch (e) { alert("❌ Error"); }
    setIsPushing(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
      background: 'rgba(15, 15, 15, 0.9)', color: '#fff', padding: '10px 18px',
      borderRadius: '12px', display: 'flex', alignItems: 'center',
      gap: '14px', border: '1px solid #333', backdropFilter: 'blur(8px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontFamily: 'monospace'
    }}>
      {/* Resource Section */}
      <div style={{ fontSize: '10px', display: 'flex', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#666', fontSize: '8px' }}>CPU</span>
          <span style={{ color: stats.cpu > 80 ? '#ff4444' : '#4ade80' }}>{stats.cpu}%</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#666', fontSize: '8px' }}>RAM</span>
          <span style={{ color: stats.ram > 85 ? '#ff4444' : '#4ade80' }}>{stats.ram}%</span>
        </div>
      </div>
      
      <div style={{ borderLeft: '1px solid #222', height: '20px' }} />

      {/* File Integrity Section */}
      <div style={{ fontSize: '10px', display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: '#888', fontSize: '8px' }}>LOCAL FILE SAVE</span>
        <span style={{ color: '#facc15' }}>{stats.lastChange}</span>
      </div>

      <div style={{ borderLeft: '1px solid #222', height: '20px' }} />

      {/* Time & Sync Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '11px', color: '#aaa' }}>{currentTime}</span>
        <button 
          onClick={handlePush}
          disabled={isPushing}
          style={{
            background: isPushing ? '#222' : '#fff', color: '#000', 
            border: 'none', padding: '4px 10px', borderRadius: '4px', 
            cursor: isPushing ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '9px'
          }}
        >
          {isPushing ? 'SYNCING...' : 'SYNC GITHUB'}
        </button>
      </div>
    </div>
  );
}
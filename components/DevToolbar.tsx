'use client';
import { useState, useEffect } from 'react';

export default function DevToolbar() {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [stats, setStats] = useState({ cpu: 0, ram: 0 });
  const [isPushing, setIsPushing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Only show on the preview domain
    if (!window.location.hostname.includes('preview.dev')) return;
    setIsVisible(true);

    // 2. Live Sydney Time (Handles Daylight Savings)
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString('en-AU', { 
        hour12: false, 
        timeZone: 'Australia/Sydney' 
      }));
    }, 1000);

    // 3. Fetch System Stats with improved error detection
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store' // Prevents Next.js 16 from caching old stats
        });

        if (!res.ok) {
          // If we get a 307 or 404, this will log the status
          console.warn(`Stats API returned ${res.status}`);
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (e) {
        // This usually triggers if the response is HTML (redirect) instead of JSON
        console.error("Stats sync error: Check if /api/stats is public in proxy.ts");
      }
    };
    
    fetchStats();
    const statsTimer = setInterval(fetchStats, 5000);

    return () => { clearInterval(timer); clearInterval(statsTimer); };
  }, []);

  const handlePush = async () => {
    setIsPushing(true);
    try {
      const res = await fetch('/api/git-push', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await res.json();

      if (res.ok) {
        alert("🚀 Changes Pushed to GitHub!");
        console.log("Git Output:", result.terminalOutput);
      } else {
        alert(`❌ Push Failed: ${result.details || 'Check terminal'}`);
      }
    } catch (e) { 
      alert("❌ API Connection Error. The proxy might still be blocking /api/git-push"); 
    }
    setIsPushing(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
      background: 'rgba(17, 17, 17, 0.9)', color: '#fff', padding: '12px 20px',
      borderRadius: '14px', display: 'flex', alignItems: 'center',
      gap: '16px', border: '1px solid #333', backdropFilter: 'blur(10px)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)', fontFamily: 'monospace'
    }}>
      <div style={{ fontSize: '11px', display: 'flex', gap: '10px' }}>
        <div>CPU: <span style={{ color: stats.cpu > 80 ? '#ff4444' : '#4ade80' }}>{stats.cpu}%</span></div>
        <div>RAM: <span style={{ color: stats.ram > 85 ? '#ff4444' : '#4ade80' }}>{stats.ram}%</span></div>
      </div>
      
      <div style={{ borderLeft: '1px solid #444', height: '20px' }} />

      <div style={{ fontSize: '12px' }}>
        AEST: <span style={{ color: '#aaa' }}>{lastUpdated}</span>
      </div>

      <button 
        onClick={handlePush}
        disabled={isPushing}
        style={{
          background: isPushing ? '#333' : '#fff', color: '#000', 
          border: 'none', padding: '6px 14px', borderRadius: '8px', 
          transition: 'all 0.2s',
          cursor: isPushing ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '11px'
        }}
      >
        {isPushing ? 'Pushing...' : 'Sync GitHub'}
      </button>
    </div>
  );
}
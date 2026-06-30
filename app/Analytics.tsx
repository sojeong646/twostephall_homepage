'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 홈페이지는 예약시스템(status.twostephall.com)의 통계 API로 방문 기록을 보냄
function trackUrl(): string {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3001/api/track';
  }
  return 'https://status.twostephall.com/api/track';
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return String(Math.random()).slice(2) + String(Date.now());
  }
}

function getSessionId(): string {
  try {
    let s = localStorage.getItem('tsh_sid');
    if (!s) {
      s = newId();
      localStorage.setItem('tsh_sid', s);
    }
    return s;
  } catch {
    return 'anon';
  }
}

function send(payload: Record<string, unknown>, url: string): void {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }));
    } else {
      fetch(url, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'text/plain' },
        keepalive: true,
        mode: 'no-cors',
      });
    }
  } catch {
    // 무시
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const url = trackUrl();
    const viewId = newId();
    const sessionId = getSessionId();
    const device = window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';
    const start = Date.now();

    send(
      {
        type: 'pageview',
        view_id: viewId,
        session_id: sessionId,
        site: 'homepage',
        path: pathname || '/',
        referrer: document.referrer || '',
        device,
      },
      url
    );

    let sent = false;
    const sendDuration = () => {
      if (sent) return;
      sent = true;
      send({ type: 'duration', view_id: viewId, duration_ms: Date.now() - start }, url);
    };
    const onVis = () => {
      if (document.visibilityState === 'hidden') sendDuration();
    };

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', sendDuration);

    return () => {
      sendDuration();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', sendDuration);
    };
  }, [pathname]);

  return null;
}

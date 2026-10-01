'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Drop {
  x: number;
  y: number;
  vy: number;
  kind: 'apple' | 'green' | 'bug';
  rot: number;
  spin: number;
}

const BEST_KEY = 'apple-catch-best';

/**
 * A tiny "catch the apples" game for the 404 page. Move with the mouse, finger or
 * ← → keys. Green apples are bonus points, bugs cost a life.
 */
export function AppleCatch() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const stateRef = useRef({ score: 0, lives: 3 });

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
    } catch {
      // ignore
    }
  }, []);

  const finish = useCallback((finalScore: number) => {
    setPhase('over');
    setBest((b) => {
      const next = Math.max(b, finalScore);
      try {
        localStorage.setItem(BEST_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    stateRef.current = { score: 0, lives: 3 };
    setScore(0);
    setLives(3);

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const basket = { x: w / 2, target: w / 2, width: 84 };
    const drops: Drop[] = [];
    const keys = { left: false, right: false };
    let spawnIn = 0;
    let elapsed = 0;
    let last = performance.now();
    let raf = 0;
    let over = false;

    const pointerTo = (clientX: number) => {
      const r = canvas.getBoundingClientRect();
      basket.target = Math.max(basket.width / 2, Math.min(w - basket.width / 2, clientX - r.left));
    };
    const onPointer = (e: PointerEvent) => pointerTo(e.clientX);
    const onKey = (e: KeyboardEvent) => {
      const down = e.type === 'keydown';
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = down;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = down;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
    };
    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    const emoji: Record<Drop['kind'], string> = { apple: '🍎', green: '🍏', bug: '🐛' };

    const frame = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      elapsed += dt;

      if (keys.left) basket.target -= 460 * dt;
      if (keys.right) basket.target += 460 * dt;
      basket.target = Math.max(basket.width / 2, Math.min(w - basket.width / 2, basket.target));
      basket.x += (basket.target - basket.x) * Math.min(1, dt * 18);

      spawnIn -= dt;
      if (spawnIn <= 0) {
        const r = Math.random();
        drops.push({
          x: 24 + Math.random() * (w - 48),
          y: -24,
          vy: 120 + Math.random() * 70 + elapsed * 5,
          kind: r < 0.14 ? 'bug' : r < 0.26 ? 'green' : 'apple',
          rot: 0,
          spin: (Math.random() - 0.5) * 3,
        });
        spawnIn = Math.max(0.28, 0.85 - elapsed * 0.012);
      }

      ctx.clearRect(0, 0, w, h);
      const basketY = h - 34;

      for (let i = drops.length - 1; i >= 0; i -= 1) {
        const d = drops[i];
        d.y += d.vy * dt;
        d.rot += d.spin * dt;

        const caught = d.y > basketY - 18 && d.y < basketY + 14 && Math.abs(d.x - basket.x) < basket.width / 2 + 4;
        if (caught) {
          drops.splice(i, 1);
          if (d.kind === 'bug') {
            stateRef.current.lives -= 1;
            setLives(stateRef.current.lives);
            if (typeof navigator.vibrate === 'function') navigator.vibrate(40);
            if (stateRef.current.lives <= 0 && !over) {
              over = true;
              finish(stateRef.current.score);
            }
          } else {
            stateRef.current.score += d.kind === 'green' ? 3 : 1;
            setScore(stateRef.current.score);
          }
          continue;
        }
        if (d.y > h + 30) {
          drops.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji[d.kind], 0, 0);
        ctx.restore();
      }

      // Basket
      ctx.save();
      ctx.translate(basket.x, basketY);
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#f5f5f7' : '#1d1d1f';
      ctx.beginPath();
      ctx.roundRect(-basket.width / 2, -10, basket.width, 26, [4, 4, 16, 16]);
      ctx.fill();
      ctx.restore();

      if (!over) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      over = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, [phase, finish]);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 flex items-center justify-between px-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
        <span>
          Score <span className="tabular-nums text-neutral-900 dark:text-white">{score}</span>
        </span>
        <span aria-label={`${lives} lives left`}>{'❤️'.repeat(Math.max(0, lives)) || '—'}</span>
        <span>
          Best <span className="tabular-nums text-neutral-900 dark:text-white">{best}</span>
        </span>
      </div>

      <div
        ref={wrapRef}
        className="glass squircle relative h-72 w-full touch-none select-none overflow-hidden rounded-3xl sm:h-80"
        role="application"
        aria-label="Catch the apples game. Move with the mouse, touch or arrow keys."
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {phase !== 'playing' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/50 px-6 text-center backdrop-blur-sm dark:bg-black/50">
            {phase === 'over' && (
              <p className="text-lg font-semibold">
                Game over — you caught <span className="text-accent">{score}</span> 🍎
              </p>
            )}
            {phase === 'idle' && <p className="text-sm text-neutral-600 dark:text-neutral-300">Lost? Catch some apples while you&apos;re here.</p>}
            <Button size="sm" onClick={() => setPhase('playing')}>
              {phase === 'over' ? 'Play again' : 'Play'}
            </Button>
            <p className="text-xs text-neutral-500">🍎 +1 · 🍏 +3 · 🐛 costs a life</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateIcon } from '@/components/icons';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

const CODE = `import SwiftUI

struct JoinView: View {
    @State private var members = 50

    var body: some View {
        VStack(spacing: 16) {
            Text("Apple Club EPI")
                .font(.largeTitle.bold())

            Text("\\(members)+ builders")
                .foregroundStyle(.secondary)

            Button("Join us 🍎") {
                members += 1
            }
            .buttonStyle(.borderedProminent)
        }
    }
}`;

type Tok = { text: string; cls: string };

const KEYWORDS = new Set(['import', 'struct', 'var', 'some', 'private']);
const TOKEN_RE = /(\/\/.*)|("(?:[^"\\]|\\.)*")|(@\w+)|(\b\d+\b)|(\.[a-zA-Z]+)|(\b[A-Z][A-Za-z]*\b)|(\b[a-z][A-Za-z]*\b)|(\s+|[^\sA-Za-z0-9])/g;

function tokenize(code: string): Tok[] {
  const out: Tok[] = [];
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code))) {
    const [text, comment, str, attr, num, member, type, word] = m;
    let cls = 'text-neutral-700 dark:text-neutral-200';
    if (comment) cls = 'text-neutral-400 dark:text-neutral-500';
    else if (str) cls = 'text-orange-600 dark:text-orange-300';
    else if (attr) cls = 'text-violet-600 dark:text-violet-300';
    else if (num) cls = 'text-emerald-600 dark:text-emerald-300';
    else if (member) cls = 'text-sky-700 dark:text-sky-300';
    else if (type) cls = 'text-fuchsia-700 dark:text-pink-300';
    else if (word && KEYWORDS.has(word)) cls = 'text-pink-600 dark:text-pink-400';
    out.push({ text, cls });
  }
  return out;
}

const TOTAL = CODE.length;

/**
 * An Xcode-style window that types real SwiftUI code while a live iPhone preview builds
 * itself line by line — and the finished button actually works.
 */
export function CodeShowcase() {
  const tokens = useMemo(() => tokenize(CODE), []);
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(false);
  const [members, setMembers] = useState(50);
  const hostRef = useRef<HTMLDivElement>(null);

  // Start typing once the window scrolls into view (or show everything for reduced motion).
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(TOTAL);
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || typed >= TOTAL) return;
    const ch = CODE[typed];
    // Pause a little longer at line breaks so it feels human.
    const delay = ch === '\n' ? 90 : 9 + Math.random() * 18;
    const advance = ch === ' ' || /[\ud800-\udbff]/.test(ch) ? 2 : 1; // never split an emoji
    const t = window.setTimeout(() => setTyped((n) => Math.min(TOTAL, n + advance)), delay);
    return () => window.clearTimeout(t);
  }, [started, typed]);

  const done = typed >= TOTAL;
  const seen = CODE.slice(0, typed);
  const hasTitle = seen.includes('Text("Apple Club EPI")');
  const bigTitle = seen.includes('.font(.largeTitle.bold())');
  const hasCount = seen.includes('foregroundStyle(.secondary)');
  const hasButton = seen.includes('members += 1');
  const prominent = seen.includes('.borderedProminent)');

  // Syntax-highlighted slice of the code typed so far
  const visible: Tok[] = [];
  let used = 0;
  for (const tok of tokens) {
    if (used >= typed) break;
    const take = Math.min(tok.text.length, typed - used);
    visible.push({ text: tok.text.slice(0, take), cls: tok.cls });
    used += take;
  }

  const lineCount = visible.map((t) => t.text).join('').split('\n').length;

  const replay = () => {
    setMembers(50);
    setTyped(0);
    setStarted(true);
  };

  return (
    <Section id="build" className="overflow-hidden">
      <Reveal>
        <SectionHeading
          eyebrow="Build"
          title="Write it. See it. Ship it."
          description="This is what a first workshop feels like: a few lines of SwiftUI, and your idea is alive on a phone."
        />
      </Reveal>

      <Reveal delay={100}>
        <div ref={hostRef} className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Editor */}
          <div className="neon-card squircle overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10 dark:border-neutral-800 dark:bg-[#1c1c1e] dark:shadow-black/60">
            <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-100/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 truncate font-mono text-xs text-neutral-500 dark:text-neutral-400">JoinView.swift</span>
              <span
                className={cn(
                  'ml-auto hidden items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors sm:flex',
                  done ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-neutral-200 text-neutral-500 dark:bg-white/10 dark:text-neutral-400',
                )}
              >
                {done ? '✓ Build Succeeded' : 'Typing…'}
              </span>
              <button
                type="button"
                onClick={replay}
                aria-label="Replay typing"
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:ml-1 dark:hover:bg-white/10"
              >
                <RotateIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex overflow-x-auto p-4 font-mono text-[11.5px] leading-[1.75] sm:p-6 sm:text-[13.5px]" aria-label="SwiftUI code sample">
              <div aria-hidden className="select-none pr-4 text-right text-neutral-300 dark:text-neutral-600">
                {Array.from({ length: CODE.split('\n').length }, (_, i) => (
                  <div key={i} className={i < lineCount ? 'text-neutral-400 dark:text-neutral-500' : ''}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="relative min-w-0 flex-1">
                {/* invisible full text reserves the final height/width */}
                <pre aria-hidden className="invisible whitespace-pre">
                  {CODE}
                </pre>
                <pre className="absolute inset-0 whitespace-pre">
                  {visible.map((t, i) => (
                    <span key={i} className={t.cls}>
                      {t.text}
                    </span>
                  ))}
                  <span className={cn('ml-px inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-accent', done ? 'animate-pulse' : '')} />
                </pre>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[17rem] sm:max-w-xs">
              <div aria-hidden className="absolute -inset-8 -z-10 rounded-full bg-accent/20 blur-3xl" />
              <div className="squircle aspect-[9/16] rounded-[2.4rem] bg-neutral-900 p-2.5 shadow-2xl ring-1 ring-white/20 dark:bg-neutral-800">
                <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[1.9rem] bg-white px-5 text-center dark:bg-black">
                  <span aria-hidden className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
                  <p className="absolute right-4 top-9 text-[10px] font-medium uppercase tracking-wider text-neutral-400">Live preview</p>

                  <div className="flex flex-col items-center gap-4">
                    <p
                      className={cn(
                        'font-sans tracking-tight text-neutral-900 transition-all duration-500 dark:text-white',
                        hasTitle ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                        bigTitle ? 'text-3xl font-bold' : 'text-base font-normal',
                      )}
                    >
                      Apple Club EPI
                    </p>
                    <p
                      className={cn(
                        'text-sm tabular-nums text-neutral-500 transition-all duration-500',
                        hasCount ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                      )}
                    >
                      {members}+ builders
                    </p>
                    <button
                      type="button"
                      disabled={!hasButton || !done}
                      onClick={() => setMembers((n) => n + 1)}
                      data-sound="chime"
                      className={cn(
                        'rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                        hasButton ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                        prominent ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-transparent text-accent',
                      )}
                    >
                      Join us 🍎
                    </button>
                  </div>

                  {done && (
                    <p className="absolute inset-x-0 bottom-5 animate-fade-in text-[11px] text-neutral-400">Go on — tap the button.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

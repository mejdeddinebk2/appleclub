'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

type VoiceLang = 'fr-FR' | 'en-US' | 'ar-TN';

const LANG_LABEL: Record<VoiceLang, string> = { 'fr-FR': 'FR', 'en-US': 'EN', 'ar-TN': 'AR' };
const LANG_ORDER: VoiceLang[] = ['fr-FR', 'en-US', 'ar-TN'];

const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const GREETING: Message = {
  role: 'assistant',
  content:
    "Salut, je suis APPLE-EPI 🤖🍎 — l'assistant de l'Apple Club EPI. Je parle français, English, et العربية. Demande-moi n'importe quoi sur le club, nos events, ou du Swift/iOS — à l'écrit ou au micro.",
  time: now(),
};

const QUICK_REPLIES = ['Comment rejoindre le club ?', 'Vos prochains events ?', "C'est quoi Swift ?"];

// Real photos from the club's own gallery.
const HEADER_PHOTO = '/images/gallery/epi-survival-conference-crowd.jpg'; // cover banner
const WATERMARK_PHOTO = '/images/gallery/epi-sup-friends.jpg'; // body backdrop — Apple-branded tees, on-theme

/** Small apple-shaped robot mark used as APPLE-EPI's avatar everywhere. */
function AppleBotMark({ size = 20, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 10c1.2-2.4 3.4-4 6-4.4-.2 2.6-1.6 4.8-3.8 6.2 2 .2 3.8 1 5.2 2.4C36.6 9.6 41 13 41 20c0 9.4-6.4 20-11.6 20-2 0-2.8-1.2-5.4-1.2S19.6 40 17.6 40C12.4 40 6 30 6 20.4 6 13.6 10.6 9.8 15.2 9.8c2.4 0 4 1.4 6 1.4.6 0 1.6-.4 2.8-1.2Z"
        fill="currentColor"
      />
      <circle cx="19" cy="21" r="2.2" className={active ? 'fill-white' : 'fill-white/90'} />
      <circle cx="29" cy="21" r="2.2" className={active ? 'fill-white' : 'fill-white/90'} />
      <path d="M18 28c2 2 10 2 12 0" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-sky-300" aria-hidden="true">
      <path d="m12 1 2.6 1.6 3-.4 1 2.9 2.9 1-.4 3L23 12l-1.9 2.4.4 3-2.9 1-1 2.9-3-.4L12 23l-2.6-1.6-3 .4-1-2.9-2.9-1 .4-3L1 12l1.9-2.4-.4-3 2.9-1 1-2.9 3 .4L12 1Z" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5.1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SentTick() {
  return (
    <svg width="13" height="9" viewBox="0 0 16 11" fill="none" className="text-white/70" aria-hidden="true">
      <path d="M1 5.5 5 9l4.5-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 5.5 10.5 9 15 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SoundBars({ active }: { active: boolean }) {
  return (
    <div className="flex h-3.5 items-end gap-[2px]">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-[2.5px] rounded-full bg-current ${active ? 'animate-[soundbar_0.9s_ease-in-out_infinite]' : 'h-1 opacity-40'}`}
          style={active ? { animationDelay: `${i * 0.12}s` } : undefined}
        />
      ))}
      <style jsx>{`
        @keyframes soundbar {
          0%,
          100% {
            height: 3px;
          }
          50% {
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
}

// Minimal typings for the Web Speech API (not in default lib.dom.d.ts everywhere).
interface SpeechRecognitionResultLike {
  transcript: string;
}
interface SpeechRecognitionEventLike extends Event {
  results: { [i: number]: { [j: number]: SpeechRecognitionResultLike }; length: number };
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceLang, setVoiceLang] = useState<VoiceLang>('fr-FR');

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) {
      setHasOpenedOnce(true);
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Set up speech recognition (mic input) once, client-side only.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: SpeechRecognitionEventLike) => {
      const transcript = e.results[e.results.length - 1][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    setVoiceSupported(true);

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function cycleVoiceLang() {
    const i = LANG_ORDER.indexOf(voiceLang);
    setVoiceLang(LANG_ORDER[(i + 1) % LANG_ORDER.length]);
  }

  function toggleListening() {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      setError(null);
      recognition.lang = voiceLang;
      recognition.start();
      setListening(true);
    }
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const prefix = voiceLang.slice(0, 2);
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang?.toLowerCase().startsWith(prefix));
    if (match) utter.voice = match;
    utter.lang = voiceLang;
    utter.rate = 1.02;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const nextMessages: Message[] = [...messages, { role: 'user', content: text, time: now() }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Une erreur est survenue.');
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, time: now() }]);
        if (voiceOn) speak(data.reply);
      }
    } catch {
      setError('Impossible de contacter APPLE-EPI. Vérifie ta connexion.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fermer le chat APPLE-EPI' : 'Ouvrir le chat APPLE-EPI'}
        className="group fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_30px_rgba(0,113,227,0.45)] transition-all duration-300 hover:scale-105 hover:bg-accent-hover hover:shadow-[0_10px_40px_rgba(0,113,227,0.6)] active:scale-95 sm:bottom-6 sm:right-6"
      >
        <span className="absolute inset-0 -z-10 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full bg-accent/40" />
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <AppleBotMark size={26} />
        )}
        {!hasOpenedOnce && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950">
            1
          </span>
        )}
        <style jsx>{`
          @keyframes pulse-ring {
            0% {
              transform: scale(1);
              opacity: 0.55;
            }
            100% {
              transform: scale(1.6);
              opacity: 0;
            }
          }
        `}</style>
      </button>

      {/* Chat panel */}
      <div
        style={{ transformOrigin: 'bottom right' }}
        className={`fixed bottom-24 right-5 z-[90] flex w-[92vw] max-w-sm flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl transition-all duration-300 ease-out dark:border-white/10 dark:bg-neutral-950 sm:right-6 ${
          open
            ? 'pointer-events-auto h-[74vh] max-h-[600px] scale-100 opacity-100'
            : 'pointer-events-none h-[74vh] max-h-[600px] scale-90 opacity-0'
        }`}
      >
        {/* Header: real cover photo from the club's gallery */}
        <div className="relative h-24 shrink-0 bg-neutral-800">
          <div
            className="absolute inset-0 bg-cover bg-[center_30%]"
            style={{ backgroundImage: `url(${HEADER_PHOTO})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          <div className="absolute inset-x-3 bottom-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow transition ${
                  speaking ? 'ring-2 ring-white' : ''
                }`}
              >
                <AppleBotMark size={18} active />
              </div>
              <div className="leading-tight text-white">
                <p className="flex items-center gap-1 text-sm font-semibold drop-shadow">
                  APPLE-EPI <VerifiedBadge />
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-white/85 drop-shadow">
                  <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${loading ? 'animate-pulse' : ''}`} />
                  {speaking ? 'En train de parler…' : listening ? "Je t'écoute…" : 'En ligne'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {speaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  title="Arrêter la lecture vocale"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="5" width="14" height="14" rx="2" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (voiceOn) stopSpeaking();
                  setVoiceOn((v) => !v);
                }}
                aria-pressed={voiceOn}
                title={voiceOn ? 'Désactiver la voix' : 'Activer la voix (réponses lues à voix haute)'}
                className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur transition ${
                  voiceOn ? 'bg-white text-accent' : 'bg-black/30 text-white hover:bg-black/50'
                }`}
              >
                {voiceOn ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9v6h4l5 5V4L7 9H3Z" strokeLinejoin="round" />
                    <path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9v6h4l5 5V4L7 9H3Z" strokeLinejoin="round" />
                    <path d="m17 9 4 6m0-6-4 6" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Messages, with a real club photo as a visible-but-tasteful backdrop */}
        <div className="relative min-h-0 flex-1">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-[center_25%]"
            style={{ backgroundImage: `url(${WATERMARK_PHOTO})` }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 bg-white/55 dark:bg-neutral-950/70" aria-hidden="true" />

          <div
            ref={scrollRef}
            className="relative h-full space-y-1 overflow-y-auto overflow-x-hidden px-4 py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15 [&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-white/15"
          >
            {messages.map((m, i) => {
              const prevSameRole = i > 0 && messages[i - 1].role === m.role;
              return (
                <div
                  key={i}
                  className={`flex animate-fade-in items-end gap-2 ${prevSameRole ? 'mt-1' : 'mt-3'} ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'assistant' &&
                    (prevSameRole ? (
                      <div className="w-6 shrink-0" />
                    ) : (
                      <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                        <AppleBotMark size={13} active />
                      </div>
                    ))}
                  <div className={`flex min-w-0 max-w-[80%] flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      dir="auto"
                      className={`min-w-0 whitespace-pre-wrap break-words text-sm leading-relaxed shadow-sm [overflow-wrap:anywhere] rounded-2xl px-3.5 py-2 ${
                        m.role === 'user'
                          ? `bg-accent text-white ${prevSameRole ? 'rounded-br-md' : 'rounded-br-sm'}`
                          : `bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 ${
                              prevSameRole ? 'rounded-bl-md' : 'rounded-bl-sm'
                            }`
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="mt-1 flex items-center gap-1 px-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                      {m.time}
                      {m.role === 'user' && <SentTick />}
                    </span>
                  </div>
                </div>
              );
            })}

            {messages.length === 1 && !loading && (
              <div className="animate-fade-in pb-1 pl-8 pt-2">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400">Suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-accent/25 bg-white px-3 py-1.5 text-xs font-medium text-accent shadow-sm transition hover:bg-accent hover:text-white dark:bg-neutral-900"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-3 flex animate-fade-in items-end gap-2">
                <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                  <AppleBotMark size={13} active />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-neutral-100 px-3.5 py-2.5 text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1.5 border-t border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-950"
        >
          {voiceSupported && (
            <button
              type="button"
              onClick={cycleVoiceLang}
              title="Langue de reconnaissance et de lecture vocale"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-[11px] font-semibold text-neutral-600 transition hover:bg-black/10 dark:bg-white/10 dark:text-neutral-300"
            >
              {LANG_LABEL[voiceLang]}
            </button>
          )}
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleListening}
              aria-pressed={listening}
              title={listening ? "Arrêter l'écoute" : 'Parler à APPLE-EPI'}
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-accent transition ${
                listening ? 'bg-red-500 text-white' : 'bg-black/5 hover:bg-black/10 dark:bg-white/10'
              }`}
            >
              {listening ? (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />
                  <SoundBars active />
                </>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0M12 19v3" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="auto"
            placeholder={listening ? "Je t'écoute…" : 'Écris un message…'}
            disabled={loading}
            className="min-w-0 flex-1 rounded-full border border-black/10 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/15"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Envoyer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

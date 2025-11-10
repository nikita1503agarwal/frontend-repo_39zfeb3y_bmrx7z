import React, { useEffect, useRef, useState } from 'react';
import { Send, Languages, Image as ImageIcon } from 'lucide-react';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'hi', label: 'हिन्दी' },
];

function backendBase() {
  const env = import.meta.env.VITE_BACKEND_URL;
  if (env && typeof env === 'string') return env.replace(/\/$/, '');
  try {
    const url = new URL(window.location.href);
    url.port = '8000';
    return url.origin;
  } catch {
    return '';
  }
}

export default function ChatWidget() {
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const [language, setLanguage] = useState('en');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! Ask me anything or switch languages from the globe icon.' },
  ]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  const API_BASE = backendBase();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: text, language }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || 'No response' }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const onUploadImage = async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append('image', file);
    form.append('plant_type', '');
    form.append('language', language);
    setMessages((m) => [...m, { role: 'user', content: 'Uploaded an image for crop diagnosis…' }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/diagnose`, { method: 'POST', body: form });
      const data = await res.json();
      const summary = `\n${data.title}\n\nDisease: ${data.predicted_disease}\nConfidence: ${((data.confidence || 0) * 100).toFixed(0)}%\n\nNext steps:\n- ${(data.recommendations || []).join('\n- ')}`;
      setMessages((m) => [...m, { role: 'assistant', content: summary }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Image analysis failed. Please try a clear photo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur rounded-xl border border-white/60 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="font-semibold">AI Assistant</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-white/10 border border-white/30 rounded-md pl-7 pr-8 py-1 text-sm focus:outline-none"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code} className="bg-white text-gray-900">
                  {l.label}
                </option>
              ))}
            </select>
            <Languages size={16} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 pointer-events-none" />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 transition px-2 py-1 rounded-md text-sm"
          >
            <ImageIcon size={16} /> Diagnose
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onUploadImage(e.target.files[0])} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-blue-50 text-blue-900 ml-auto' : 'bg-gray-50 text-gray-900'}`}>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t bg-white/60">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message…"
            rows={1}
            className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg"
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

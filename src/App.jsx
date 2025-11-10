import React from 'react'
import Spline from '@splinetool/react-spline'
import ChatWidget from './ChatWidget'

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f1021] via-[#14163a] to-[#0b0c1e] text-white">
      {/* Hero Section with Spline */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* Overlay copy */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent drop-shadow-md">
            Emergent‑style AI Platform
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80">
            Multilingual AI assistant and Crop Doctor that analyzes your plant photos and gives actionable guidance.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[360px] md:h-[420px]">
              <ChatWidget />
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold">Why farmers love this</h3>
              <ul className="mt-3 space-y-2 text-white/80 list-disc list-inside">
                <li>Understands 6 languages out of the box</li>
                <li>Uploads a photo to get instant diagnosis</li>
                <li>Clear next steps you can apply today</li>
                <li>Modern, fast, mobile‑friendly experience</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gradient edge aura so scene stands out */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(115,48,255,0.25),transparent_60%)]" />
      </section>

      {/* Feature section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: 'Multilingual', d: 'Converse in English, Español, Français, Deutsch, Italiano, हिन्दी.' },
            { t: 'Vision AI', d: 'Analyze crop images for likely diseases with practical steps.' },
            { t: 'Privacy-first', d: 'Your data stays secure; only what you share is analyzed.' },
          ].map((f, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="font-semibold">{f.t}</h4>
              <p className="text-white/80 mt-2 text-sm">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center text-white/60">Built with love for growers and teams.</footer>
    </div>
  )
}

export default App

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, MessageSquare, ShieldCheck, Zap, Sparkles, Cpu, Award } from 'lucide-react';

export default function CaseStudy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-800 py-16 px-4 md:px-8 max-w-5xl mx-auto font-sans">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-xs font-mono text-blue-600 hover:text-blue-500 transition-colors mb-12 group cursor-pointer"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO PORTFOLIO
      </button>

      {/* Header */}
      <div className="space-y-4 mb-12">
        <span className="text-xs font-mono bg-blue-50 border border-blue-200/60 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">
          FULL STACK ARCHITECTURE CASE STUDY
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">
          Book Exchange Platform: Swapping Physical Literature at Scale
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          An engineering breakdown of a decentralized swap marketplace resolving trust, discovery, and automated content summaries in sharing economies.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-xs font-mono text-slate-500 mb-1">TECH STACK</div>
          <div className="text-sm font-semibold text-slate-900">MERN & WebSockets</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-xs font-mono text-slate-500 mb-1">SWAP VERIFICATION</div>
          <div className="text-sm font-semibold text-blue-600">Mutual OTP Handshake</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-xs font-mono text-slate-500 mb-1">AI SUMMARIZATION</div>
          <div className="text-sm font-semibold text-sky-600 font-display">Gemini/OpenAI SDK</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-xs font-mono text-slate-500 mb-1">IMAGE UPLINK SPEED</div>
          <div className="text-sm font-semibold text-emerald-600">120ms Latency Optim</div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-16">
        {/* The Problem */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
            <BookOpen className="text-blue-600" /> Executive summary & The Problem
          </h2>
          <div className="text-slate-600 leading-relaxed space-y-4 font-normal">
            <p>
              Swapping physical books with local readers is highly cost-efficient but suffers from core inefficiencies. Readers have no easy way of identifying who near them holds their desired titles, trade negotiations are scattered across random platforms, and meeting up with strangers to execute a swap carries an element of insecurity.
            </p>
            <p>
              I built the **Book Exchange Platform** to solve this. It provides a location-based book discovery grid, matches readers who want each other's books automatically, coordinates in-app real-time communication, and logs verified exchanges securely.
            </p>
          </div>
        </section>

        {/* System Architecture */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
            <Cpu className="text-sky-600" /> Deep Tech Architecture & Code Logic
          </h2>
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">How it works: Sequential Swap Verification Flow</h3>
            
            {/* Mermaid representation in text */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 space-y-2">
              <div>[User A lists book] --&gt; [Locates User B nearby with mutual interest]</div>
              <div>[API Creates Match Entity] --&gt; [Triggers WebSocket chat channel setup]</div>
              <div>[User A meets User B] --&gt; [Server generates unique 6-digit OTP]</div>
              <div>[User B inputs OTP via screen] --&gt; [REST Handshake confirms and logs swap transaction]</div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              We separate functions into microservices. The Express router holds session checks, while database listings handle geo-spatial search indexing. We query books based on local latitude and longitude limits using MongoDB's <code className="text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded text-xs">$near</code> functions.
            </p>
          </div>
        </section>

        {/* Feature Explanations */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Key Engineering Achievements</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ShieldCheck size={20} />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">Mutual Return & Safety Checks</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We safeguard trading books by enforcing OTP completion checks of trades. If coordinates do not coordinate, or the OTP mismatches, the transaction states revert inside MongoDB. This completely eliminates one-sided scam trades.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <span className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-650">
                <Sparkles size={20} />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">AI Book Summaries Engine</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Using Gemini GenAI SDK endpoints, we automate summary generation for every newly listed book. The summary is parsed and stored inside our model, rendering insights, reading time, and bullet-pointed tags.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <MessageSquare size={20} />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">Real-Time Messaging Matrix</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                WebSocket sockets powered by Socket.io map chats between matched users directly. Chat states are persisted into MongoDB documents, updating the frontend in real time, bypassing slow API polling overheads.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Zap size={20} />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">Automated CDN Cleanups</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Images uploaded through Multer are encoded into streams and pushed to Cloudinary. On successful uploads, Node deletes local files, ensuring zero memory leak overheads inside temporary container folders.
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion / Takeaway */}
        <section className="glass-panel p-8 rounded-3xl border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Award className="text-blue-600" /> Engineering Impact
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              This project demonstrates deep competence in designing full-stack state flows. It moves away from trivial "Todo list" applications to resolve complex engineering bottlenecks: geolocation search indexing, websocket concurrency controls, external SDK payloads error boundaries, and production security validations.
            </p>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200 mt-16 pt-8 text-center text-xs font-mono text-slate-500">
        © 2026 Yogendra N • Computer Science Architecture Case Studies
      </div>
    </div>
  );
}

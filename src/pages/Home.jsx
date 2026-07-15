import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { portfolioData } from '../utils/portfolioData';

// ─── Lucide icons (subset we actually use) ─────────────────
import {
  Github, Linkedin, ExternalLink, Download, Mail, Phone,
  ArrowUp, Menu, X, MapPin,
} from 'lucide-react';

// ─── Skill categories order ──────────────────────────────────
const SKILL_GROUPS = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'Tools',
  'Core Concepts',
];

// ─── useReveal – fade up on scroll ─────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Typing animation hook ───────────────────────────────────
function useTyping(words) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let delay = deleting ? 35 : 90;

    const t = setTimeout(() => {
      if (!deleting && charIdx < word.length) {
        setDisplay(word.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === word.length) {
        setTimeout(() => setDeleting(true), 1600);
      } else if (deleting && charIdx > 0) {
        setDisplay(word.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setWordIdx(i => (i + 1) % words.length);
      }
    }, delay);

    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words]);

  return display;
}

// ─── Counter that animates on intersection ───────────────────
function AnimCounter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(to / 50);
        const timer = setInterval(() => {
          start = Math.min(start + step, to);
          setVal(start);
          if (start >= to) clearInterval(timer);
        }, 25);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ═══════════════════════════════════════════════════════════
export default function Home() {
  const navigate = useNavigate();
  const { profile, education, skills, experiences, projects, achievements, certifications } = portfolioData;
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // group skills by category
  const skillsByCategory = SKILL_GROUPS.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const typed = useTyping(['Full Stack Developer', 'MERN Stack Engineer', 'Problem Solver', 'CSE Student']);

  useReveal();

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const tot = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(tot > 0 ? (window.scrollY / tot) * 100 : 0);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const onContact = (data) => new Promise(resolve => {
    setTimeout(() => {
      toast.success('Message received! I\'ll get back to you soon.');
      reset();
      resolve();
    }, 800);
  });

  const navLinks = ['about', 'skills', 'experience', 'projects', 'achievements', 'contact'];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>
      {/* Scroll progress */}
      <div id="scroll-progress" style={{ width: `${scrollPct}%` }} />

      {/* ── Navbar ────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', fontFamily: 'Inter, sans-serif' }}>
            Yogendra N
          </button>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: 28 }} className="hidden-mobile">
            {navLinks.map(id => (
              <button key={id} onClick={() => scrollTo(id)} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>
                {id}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'none' }}
            className="show-mobile"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                padding: '10px 0', color: '#475569', fontSize: 15, fontFamily: 'Inter, sans-serif', textTransform: 'capitalize', borderBottom: '1px solid #f1f5f9'
              }}>
                {id}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', width: '100%', paddingTop: 120, paddingBottom: 80, display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }} className="hero-grid">
          {/* Left — Text */}
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#2563eb', marginBottom: 20, letterSpacing: '0.05em' }}>
              Hi, my name is
            </p>
            <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.1, marginBottom: 16 }}>
              Yogendra N.
            </h1>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 600, letterSpacing: '-0.02em', color: '#64748b', lineHeight: 1.2, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
              {typed}<span className="typing-cursor" />
            </h2>
            <p style={{ maxWidth: 520, color: '#475569', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
              {profile.tagline}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <button onClick={() => scrollTo('projects')} className="btn-primary">View Projects</button>
              <a href={profile.resumeUrl} download className="btn-secondary">
                <Download size={15} /> Resume
              </a>
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <a href={profile.gitHubUrl} target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#64748b'}>
                <Github size={20} />
              </a>
              <a href={profile.linkedInUrl} target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#2563eb'} onMouseOut={e => e.currentTarget.style.color='#64748b'}>
                <Linkedin size={20} />
              </a>
              <a href={`mailto:${profile.email}`} style={{ color: '#64748b', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#2563eb'} onMouseOut={e => e.currentTarget.style.color='#64748b'}>
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Right — Profile Image */}
          <div style={{ position: 'relative', width: 280, height: 320 }} className="hero-image-wrap">
            {/* Decorative backdrop */}
            <div style={{
              position: 'absolute', top: 16, left: 16, width: '100%', height: '100%',
              border: '2px solid #2563eb', borderRadius: 16, zIndex: 0,
              opacity: 0.35
            }} />
            {/* Image container */}
            <div style={{
              position: 'relative', zIndex: 1, width: '100%', height: '100%',
              borderRadius: 16, overflow: 'hidden',
              border: '2px solid #e2e8f0',
              background: 'linear-gradient(135deg, #f0f5ff 0%, #e8eef9 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(37,99,235,0.08)',
            }}>
              <img
                src="src\assets\yoge_img.png"
                alt="Yogendra N – Profile"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback placeholder (hidden when image loads) */}
              <div style={{
                display: 'none', flexDirection: 'column', alignItems: 'center', gap: 8,
                color: '#94a3b8', fontSize: 13, fontFamily: 'JetBrains Mono, monospace',
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Your Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── About ─────────────────────────────────────────── */}
      <section id="about" className="section">
        <p className="section-label reveal">01. About</p>
        <h2 className="section-title reveal">About Me</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }} className="reveal">
          {/* Bio */}
          <div>
            <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
              {profile.aboutMe}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
              {profile.currentFocus.slice(0, 6).map((focus, i) => (
                <span key={i} className="badge">→ {focus}</span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>Education</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {education.map((edu, i) => (
                <div key={i} style={{ padding: '16px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{edu.degree}</p>
                      <p style={{ fontSize: 13, color: '#475569' }}>{edu.school}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748b' }}>{edu.duration}</span>
                      {edu.metrics && <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#2563eb', marginTop: 2 }}>{edu.metrics}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Skills ────────────────────────────────────────── */}
      <section id="skills" className="section">
        <p className="section-label reveal">02. Skills</p>
        <h2 className="section-title reveal">Technical Skills</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {SKILL_GROUPS.map(cat => {
            const group = skillsByCategory[cat];
            if (!group || group.length === 0) return null;
            return (
              <div key={cat} className="reveal">
                <p style={{
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 12,
                }}>
                  {cat === 'Programming Languages' ? 'Languages' : cat}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {group.map((skill, i) => (
                    <span key={i} style={{
                      fontSize: 13,
                      color: '#475569',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 5,
                      padding: '4px 12px',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'color 0.15s, border-color 0.15s',
                      cursor: 'default',
                    }}
                      onMouseOver={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#2563eb'; }}
                      onMouseOut={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* ── Experience ────────────────────────────────────── */}
      <section id="experience" className="section">
        <p className="section-label reveal">03. Experience</p>
        <h2 className="section-title reveal">Internship Experience</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 4, top: 8, bottom: 8, width: 1, background: '#e2e8f0' }} />
          {experiences.map((exp, i) => (
            <div key={i} className="reveal" style={{ paddingLeft: 28, position: 'relative' }}>
              <div className="timeline-dot" />
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.015em' }}>{exp.title}</h3>
                  <p style={{ fontSize: 14, color: '#2563eb', fontWeight: 500, marginTop: 2 }}>{exp.company}</p>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748b', alignSelf: 'flex-start', paddingTop: 2 }}>{exp.duration}</span>
              </div>
              <ul style={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {exp.responsibilities.map((r, ri) => (
                  <li key={ri} style={{ display: 'flex', gap: 10, color: '#475569', fontSize: 14, lineHeight: 1.6 }}>
                    <span style={{ color: '#2563eb', marginTop: 1, flexShrink: 0 }}>▸</span>
                    {r}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {exp.techStack.map((t, ti) => <span key={ti} className="badge">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── Projects ──────────────────────────────────────── */}
      <section id="projects" className="section">
        <p className="section-label reveal">04. Projects</p>
        <h2 className="section-title reveal">Selected Projects</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {projects.map((proj, i) => (
            <div key={i} className="card reveal" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              {/* Image */}
              <div style={{ height: 160, overflow: 'hidden', background: '#f8fafc', flexShrink: 0 }}>
                {proj.image
                  ? <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.85} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 32, fontWeight: 700 }}>{'{ }'}</div>
                }
              </div>

              {/* Content */}
              <div style={{ padding: '20px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>{proj.title}</h3>
                    {proj.metrics && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#64748b', whiteSpace: 'nowrap' }}>{proj.metrics}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{proj.description}</p>
                </div>

                {/* Tech badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'auto' }}>
                  {proj.techStack.map((t, ti) => <span key={ti} className="badge">{t}</span>)}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: 12, paddingTop: 10, borderTop: '1px solid #e2e8f0', alignItems: 'center' }}>
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#475569', transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#475569'}>
                      <Github size={14} /> GitHub
                    </a>
                  )}
                  {proj.liveDemo && proj.liveDemo !== '#' && (
                    <a href={proj.liveDemo} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#475569', transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#475569'}>
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                  {proj.caseStudy && (
                    <button onClick={() => navigate('/case-study/book-exchange')} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#1d4ed8'} onMouseOut={e => e.currentTarget.style.color='#2563eb'}>
                      Case Study →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── Achievements ──────────────────────────────────── */}
      <section id="achievements" className="section">
        <p className="section-label reveal">05. Achievements</p>
        <h2 className="section-title reveal">Milestones</h2>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 40 }} className="reveal">
          {[
            { label: 'LeetCode Rating', value: 1554, suffix: '' },
            { label: 'Problems Solved', value: 567, suffix: '+' },
            { label: 'Skillrack Solved', value: 300, suffix: '+' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700, color: '#2563eb', lineHeight: 1 }}>
                <AnimCounter to={stat.value} suffix={stat.suffix} />
              </p>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Achievement cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {achievements.map((ach, i) => (
            <div key={i} className="reveal" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'border-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#cbd5e1'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, color: '#2563eb', lineHeight: 1, marginTop: 2 }}>✦</span>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{ach.title}</h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{ach.description}</p>
                {ach.details && <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>{ach.details}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginTop: 52, marginBottom: 20 }} className="reveal">
          Certifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {certifications.map((cert, i) => (
            <div key={i} className="reveal" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#cbd5e1'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>{cert.title}</p>
                <p style={{ fontSize: 12, color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{cert.provider}</p>
              </div>
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#2563eb'} onMouseOut={e => e.currentTarget.style.color='#64748b'}>
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── Contact ───────────────────────────────────────── */}
      <section id="contact" className="section">
        <p className="section-label reveal">06. Contact</p>
        <h2 className="section-title reveal">Get In Touch</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }}>
          {/* Left info */}
          <div className="reveal">
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
              I'm currently looking for internship and full-time opportunities. Whether you have a question or just want to say hi, feel free to reach out.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a href={`mailto:${profile.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#475569', fontSize: 14, transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#475569'}>
                <Mail size={16} style={{ color: '#2563eb', flexShrink: 0 }} /> {profile.email}
              </a>
              <a href={`tel:+91${profile.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#475569', fontSize: 14, transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#475569'}>
                <Phone size={16} style={{ color: '#2563eb', flexShrink: 0 }} /> +91 {profile.phone}
              </a>
              <a href={profile.linkedInUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#475569', fontSize: 14, transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#475569'}>
                <Linkedin size={16} style={{ color: '#2563eb', flexShrink: 0 }} /> LinkedIn Profile
              </a>
              <a href={profile.gitHubUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#475569', fontSize: 14, transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#475569'}>
                <Github size={16} style={{ color: '#2563eb', flexShrink: 0 }} /> GitHub Profile
              </a>
            </div>
          </div>

          {/* Contact form */}
          <form className="reveal" onSubmit={handleSubmit(onContact)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <input
                  className="form-input"
                  placeholder="Your name"
                  {...register('name', { required: 'Required' })}
                />
                {errors.name && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.name.message}</p>}
              </div>
              <div>
                <input
                  className="form-input"
                  placeholder="Email address"
                  {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                />
                {errors.email && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <textarea
                className="form-input"
                placeholder="Your message..."
                rows={5}
                {...register('message', { required: 'Required' })}
              />
              {errors.message && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.message.message}</p>}
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      <div className="divider" />

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748b' }}>
          Built by Yogendra N — {new Date().getFullYear()}
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href={profile.gitHubUrl} target="_blank" rel="noreferrer" style={{ color: '#64748b', fontSize: 12, transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#64748b'}>GitHub</a>
          <a href={profile.linkedInUrl} target="_blank" rel="noreferrer" style={{ color: '#64748b', fontSize: 12, transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#64748b'}>LinkedIn</a>
          <a href={`mailto:${profile.email}`} style={{ color: '#64748b', fontSize: 12, transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color='#0f172a'} onMouseOut={e => e.currentTarget.style.color='#64748b'}>Email</a>
        </div>
      </footer>

      {/* ── Scroll to top ──────────────────────────────────── */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: 28, right: 28, width: 40, height: 40,
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8,
            cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, color 0.2s', zIndex: 50,
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#475569'; }}
        >
          <ArrowUp size={16} />
        </button>
      )}

      {/* Responsive CSS (inline) */}
      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          form > div:first-child { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

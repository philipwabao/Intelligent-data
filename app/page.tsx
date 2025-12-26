'use client';

import { useEffect, useMemo, useRef, useState, MouseEvent } from 'react';

import SiteFooter from './components/SiteFooter';
const services = [
    {
      key: 'cv',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <circle cx="9" cy="9" r="2" />
          <path d="M5 19 14 10l5 5" />
        </svg>
      ),
      title: 'Computer vision',
      body: 'Labels for images and video. We do boxes, polygons, keypoints, masks, and frame-by-frame tracking.',
      tags: ['Bounding boxes', 'Polygons', 'Keypoints', 'Segmentation', 'Video tracking'],
    },
    {
      key: 'nlp',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5l-3.5 3.5A1 1 0 0 1 8 19v-3H6a2 2 0 0 1-2-2Z" />
        </svg>
      ),
      title: 'Natural language',
      body: 'Text labeling for NER, classification, sentiment, and LLM fine-tuning (RLHF, instruction data).',
      tags: ['NER', 'Classification', 'Sentiment', 'RLHF', 'Instruction tuning'],
    },
    {
      key: 'custom',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" />
          <path d="M4 16a3 3 0 0 1 3-3h3" />
          <path d="M10 22v-5l2.5 1.5L15 14v8" />
        </svg>
      ),
      title: 'Custom workflows',
      body: "Need something specific? We'll work with you to define the schema, handle edge cases, and iterate.",
      tags: ['Schema design', 'Red teaming', 'Edge cases', 'Multi-modal'],
    },
  ];

  const examples = [
    {
      title: 'Image',
      label: 'Car / person / sign',
      text: 'Draw boxes around pedestrians and traffic signs.',
    },
    {
      title: 'Text',
      label: 'Intent / sentiment',
      text: 'Tag support tickets by topic and urgency.',
    },
    {
      title: 'LLM',
      label: 'Ranking',
      text: 'Rank model outputs from best to worst.',
    },
  ];

  

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

type Obstacle = { x: number; w: number; h: number; scored: boolean };

function RunnerGame() {
  const reducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<'ready' | 'running' | 'crashed'>('ready');
  const statusRef = useRef<'ready' | 'running' | 'crashed'>(status);
  const [runId, setRunId] = useState(0);
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = Number(window.localStorage.getItem('auxerta_runner_best') ?? '0');
    if (!Number.isNaN(saved)) setBest(saved);
  }, []);

  const label = useMemo(() => {
    if (reducedMotion) return 'Interactive demo disabled (Reduce Motion is enabled).';
    if (status === 'ready') return 'Click or press Space to jump.';
    if (status === 'crashed') return 'Crash — click or press Space to retry.';
    return 'Jump over QA blockers.';
  }, [reducedMotion, status]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas crisp on retina screens
    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Game state (kept outside React to avoid re-render loop)
    let raf = 0;
    let last = performance.now();
    let t = 0;

    const groundY = 118;
    const player = { x: 56, y: groundY, vy: 0, r: 10 };
    let obstacles: Obstacle[] = [];
    let nextSpawn = 1.8;
    let speed = 130;
    let alive = true;
    let localScore = 0;
    let lastEmittedScore = -1;

    const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };

    const collide = (o: Obstacle) => {
      const px = player.x;
      const py = player.y;
      const r = player.r;
      const ox = o.x;
      const oy = groundY - o.h;
      const nx = Math.max(ox, Math.min(px, ox + o.w));
      const ny = Math.max(oy, Math.min(py, oy + o.h));
      const dx = px - nx;
      const dy = py - ny;
      return dx * dx + dy * dy < r * r;
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Background
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(1, '#f3f6ff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle ambient glow
      const glow = ctx.createRadialGradient(w * 0.75, h * 0.25, 10, w * 0.75, h * 0.25, 180);
      glow.addColorStop(0, 'rgba(168,85,247,0.18)');
      glow.addColorStop(0.45, 'rgba(59,130,246,0.12)');
      glow.addColorStop(1, 'rgba(34,197,94,0.00)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.strokeStyle = 'rgba(15,23,42,0.10)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(18, groundY + 0.5);
      ctx.lineTo(w - 18, groundY + 0.5);
      ctx.stroke();

      // Obstacles
      for (const o of obstacles) {
        const x = o.x;
        const y = groundY - o.h;
        roundedRect(x, y, o.w, o.h, 10);

        const fill = ctx.createLinearGradient(x, y, x + o.w, y + o.h);
        fill.addColorStop(0, 'rgba(15,23,42,0.10)');
        fill.addColorStop(1, 'rgba(15,23,42,0.04)');
        ctx.fillStyle = fill;
        ctx.fill();

        const stroke = ctx.createLinearGradient(x, y, x + o.w, y + o.h);
        stroke.addColorStop(0, 'rgba(168,85,247,0.55)');
        stroke.addColorStop(0.4, 'rgba(59,130,246,0.55)');
        stroke.addColorStop(0.75, 'rgba(34,193,195,0.55)');
        stroke.addColorStop(1, 'rgba(34,197,94,0.55)');
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Player (Auxerta orb)
      const orb = ctx.createRadialGradient(player.x - 4, player.y - 6, 2, player.x, player.y, 16);
      orb.addColorStop(0, 'rgba(255,255,255,0.9)');
      orb.addColorStop(0.2, 'rgba(168,85,247,0.75)');
      orb.addColorStop(0.55, 'rgba(59,130,246,0.55)');
      orb.addColorStop(1, 'rgba(34,197,94,0.12)');
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(15,23,42,0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.stroke();

      // Score
      ctx.fillStyle = 'rgba(15,23,42,0.70)';
      ctx.font = '600 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.fillText(`Score ${localScore}`, 18, 22);
    };

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      const isRunning = statusRef.current === 'running';
      if (!isRunning) {
        draw();
        raf = requestAnimationFrame(step);
        return;
      }

      if (!alive) {
        draw();
        raf = requestAnimationFrame(step);
        return;
      }


      t += dt;
      speed = 130 + Math.min(60, t * 4);

      // Spawn
      nextSpawn -= dt;
      if (nextSpawn <= 0) {
        const w = 18 + Math.random() * 16;
        const h = 22 + Math.random() * 26;
        obstacles.push({ x: canvas.clientWidth + 24, w, h, scored: false });
        nextSpawn = 1.6 + Math.random() * 1.1;
      }

      // Move obstacles
      obstacles = obstacles
        .map(o => ({ ...o, x: o.x - speed * dt }))
        .filter(o => o.x + o.w > -20);

      // Score: +1 for each obstacle successfully cleared
      for (const o of obstacles) {
        if (!o.scored && o.x + o.w < player.x - player.r) {
          o.scored = true;
          localScore += 1;
          setScore(localScore);
        }
      }


      // Player physics
      const gravity = 1200;
      player.vy += gravity * dt;
      player.y += player.vy * dt;
      if (player.y > groundY) {
        player.y = groundY;
        player.vy = 0;
      }

      // Collisions
      for (const o of obstacles) {
        if (collide(o)) {
          alive = false;
          setStatus('crashed');
          setBest(prev => {
            const next = Math.max(prev, localScore);
            try {
              window.localStorage.setItem('auxerta_runner_best', String(next));
            } catch {}
            return next;
          });
          break;
        }
      }

      draw();
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    const jump = () => {
      if (reducedMotion) return;
      const s = statusRef.current;
      if (s === 'ready' || s === 'crashed') {
        // Start a fresh run
        setScore(0);
        setStatus('running');
        setRunId(v => v + 1);
        return;
      }
      if (player.y >= groundY - 0.5) {
        player.vy = -520;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('pointerdown', jump);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('pointerdown', jump);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, runId]);

  return (
    <div className="runner-card hover-lift" aria-label="Interactive QA runner demo">
      <div className="runner-card-top">
        <div className="runner-badge">QA runner</div>
        <div className="runner-stats">
          <span>Best {best}</span>
          <span className="runner-dot" aria-hidden="true" />
          <span>Now {score}</span>
        </div>
      </div>

      <div className="runner-stage" role="presentation">        <canvas key={runId} ref={canvasRef} className="runner-canvas" width={640} height={140} />
      </div>

      <div className="runner-help">{label}</div>
    </div>
  );
}
export default function HomePage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeServiceKey, setActiveServiceKey] = useState(services[0].key);

    useEffect(() => {
      const nav = document.getElementById('nav');
      if (!nav) return;

      const handleScroll = () => {
        if (window.scrollY > 24) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();

      const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.12 }
      );

      revealEls.forEach(el => observer.observe(el));

      return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }, []);

    const scrollTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.querySelector(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setMobileOpen(false);
    };

    const currentService =
      services.find(s => s.key === activeServiceKey) ?? services[0];

    return (
      <div className="page">
        {/* Navigation */}
        <header id="nav" className="nav">
          <div className="nav-inner container">
            <a href="#top" className="brand" onClick={e => scrollTo(e, '#top')}>
              <span className="brand-mark" aria-hidden="true">
  <span className="mark-pill mark-pill-1" />
  <span className="mark-pill mark-pill-2" />
  <span className="mark-pill mark-pill-3" />
</span>
              <span className="brand-text">
                <span className="brand-name">Auxerta</span>
                <span className="brand-tagline">Enterprise data annotation</span>
              </span>
            </a>

            <nav className={`nav-links ${mobileOpen ? 'nav-links-open' : ''}`}>
              <a href="#services" onClick={e => scrollTo(e, '#services')}>
                Services
              </a>
<a
                href="#contact"
                className="nav-cta"
                onClick={e => scrollTo(e, '#contact')}
              >
                Get started
              </a>
            </nav>

            <button
              className="nav-toggle"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen(v => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </header>

        <main id="top">
          {/* Hero */}
          <section className="section hero">
            <div className="hero-bg" />
            <div className="hero-glow" />
            <div className="container hero-grid" data-reveal>
              <div className="hero-left">
                <h1>Data annotation for ML teams</h1>
                <p className="hero-lead">
                  We train AI for enterprise clients with senior-led, human-first labeling and evaluation.
                </p>
                <div className="hero-actions">
                  <a
                    href="#contact"
                    className="btn btn-primary btn-primary-animated"
                    onClick={e => scrollTo(e, '#contact')}
                  >
                    Start a project
                  </a>
                  <div className="nvidia-badge-wrap">
                    <img
                      src="/nvidia-inception-program-badge-rgb-for-screen.png"
                      alt="NVIDIA Inception Program member badge"
                      className="nvidia-inception-badge"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              <aside className="hero-right">
                <div className="auxerta-sigil auxerta-sigil-hero" aria-hidden="true">
                    <div className="auxerta-orb orb-1" />
                    <div className="auxerta-orb orb-2" />
                    <div className="auxerta-orb orb-3" />
                </div>

                <RunnerGame />
              </aside>
            </div>

            {/* Example tasks strip */}
            <div className="section section-examples">
              <div className="container" data-reveal>
                <div className="examples-header">
                  <p className="eyebrow">Examples</p>
                  <h2>Typical annotation tasks</h2>
                  <p className="section-copy">
                    Simple, concrete tasks that ML engineers send us every day.
                  </p>
                </div>
                <div className="examples-row">
                  {examples.map(example => (
                    <div className="example-card hover-lift" key={example.title}>
                      <div className="example-tag">{example.title}</div>
                      <div className="example-label">{example.label}</div>
                      <p className="example-text">{example.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section id="services" className="section">
            <div className="container" data-reveal>
              <header className="section-header">
                <div>
                  <p className="eyebrow">Services</p>
                  <h2>What we do</h2>
                </div>
                <p className="section-copy">
                  Image labeling, text annotation, and custom workflows. We work with your schema or help you build one.
                </p>
              </header>

              <div className="service-layout">
                <div className="service-tabs" aria-label="Annotation services">
                  {services.map(s => (
                    <button
                      key={s.key}
                      className={`service-tab ${
                        activeServiceKey === s.key ? 'service-tab-active' : ''
                      }`}
                      type="button"
                      onClick={() => setActiveServiceKey(s.key)}
                    >
                      <span className="service-icon">{s.icon}</span>
                      <span>{s.title}</span>
                    </button>
                  ))}
                </div>
                <article className="card service-detail hover-lift">
                  <h3>{currentService.title}</h3>
                  <p>{currentService.body}</p>
                  <div className="tag-row">
                    {currentService.tags.map(tag => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Product */}
{/* Contact */}
          <section id="contact" className="section">
            <div className="container" data-reveal>
              <header className="section-header">
                <div>
                  <p className="eyebrow">Contact</p>
                  <h2>Want to work together?</h2>
                </div>
                <p className="section-copy">
                  Email us with what you need labeled, how much, and when you need it. We usually reply within a day.
                </p>
              </header>

              <div className="contact hover-lift">
                <div>
                  <p className="contact-label">Email</p>
                  <a
                    href="mailto:partner@auxerta.com?subject=Project%20inquiry"
                    className="contact-email"
                  >
                    partner@auxerta.com
                  </a>
                  <p className="contact-note">
                    Include a short description of your use case, data volume, and timing.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    );
  }
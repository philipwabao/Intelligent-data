'use client';

import { useEffect, useState, MouseEvent } from 'react';
import CareersForm from './CareersForm';
import SiteFooter from '../components/SiteFooter';

type Job = {
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  eligibilityNote?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

const JOBS: Job[] = [
  {
    title: 'Generalist',
    team: 'Engineering & Science / Students',
    location: 'Remote — United States, United Kingdom, South Korea, Japan',
    type: 'Hourly contract',
    summary:
      'Auxerta is hiring engineers, scientists, and students to build and maintain technical systems for high-integrity data workflows. This starts as an hourly contract; you choose your hours and when you work. Preferred domains: life sciences, health-adjacent data, or computer vision.',
    eligibilityNote:
      'Remote-only: United States, United Kingdom, South Korea, Japan. To apply, you must already have legal right to work in one of these locations (citizenship/passport or valid residency/work visa). We do not sponsor visas.',
    responsibilities: [
      'Design, implement, and maintain pipelines for ingestion, validation, transformation, and export.',
      'Establish and maintain quality checks (sampling, consistency validation, edge-case handling, traceability).',
      'Develop internal tools and workflows to support review and iteration.',
      'Conduct error analysis and implement improvements based on findings.',
      'Integrate with external systems when required.',
      'Ensure work is reproducible and documented, with appropriate testing and logging.',
    ],
    requirements: [
      'Eligibility: remote-only (United States, United Kingdom, South Korea, Japan). You must already have legal right to work in one of these locations (citizenship/passport or valid residency/work visa). We do not sponsor visas.',
      'Proficiency in at least one of: Python, Go, Java, C++, or Rust.',
      'Professional proficiency in English (Japanese or Korean is a plus).',
      'Demonstrated experience delivering reliable technical work.',
      'PhD, Master’s, or Bachelor’s degree with 8+ years of relevant experience.',
      'Ability to work independently in a small team environment with changing priorities.',
    ],
    niceToHave: [
      'Strong technical opinions combined with openness to discussion and feedback.',
      'Experience with cloud storage systems and basic security practices.',
      'Experience working in quality-sensitive or high-integrity systems.',
    ],
  },
];

function pickRandomJob(): Job {
  // Single open role (kept as a function so the component shape doesn't change)
  return JOBS[0];
}

function scrollTo(e: MouseEvent<HTMLElement>, target: string, close?: () => void) {
  const el = document.querySelector(target);
  if (!el) return;
  e.preventDefault();
  close?.();

  const reduce =
    typeof window !== 'undefined' &&
    'matchMedia' in window &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export default function CareersClient() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [job] = useState<Job>(() => pickRandomJob());

  useEffect(() => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const handleScroll = () => {
      if (window.scrollY > 24) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
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

  return (
    <div className="page">
      {/* Navigation */}
      <header id="nav" className="nav">
        <div className="nav-inner container">
          <a href="/" className="brand" aria-label="Auxerta home">
            <span className="brand-mark" aria-hidden="true">
              <span className="mark-pill mark-pill-1" />
              <span className="mark-pill mark-pill-2" />
              <span className="mark-pill mark-pill-3" />
            </span>
            <span className="brand-text">
              <span className="brand-name">Auxerta</span>
              <span className="brand-tagline">Careers</span>
            </span>
          </a>

          <nav className={`nav-links ${mobileOpen ? 'nav-links-open' : ''}`}>
            <a href="/#services" onClick={() => setMobileOpen(false)}>
              Services
            </a>
<a
              href="#apply"
              className="nav-cta"
              onClick={e => scrollTo(e, '#apply', () => setMobileOpen(false))}
            >
              Apply
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
              <h1>Join us!</h1>

              <div className="hero-actions">
                <a
                  href="#apply"
                  className="btn btn-primary btn-primary-animated"
                  onClick={e => scrollTo(e, '#apply')}
                >
                  Apply
                </a>
              </div>
            </div>

            <div className="hero-right">
              <div className="card card-highlight hover-lift">
                <div className="model-header">
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 6 }}>
                      OPEN ROLE
                    </div>
                    <h3 style={{ margin: 0 }}>{job.title}</h3>
                  </div>
                  <span className="pill-soft">{job.type}</span>
                </div>

                <p style={{ margin: '8px 0 12px', color: 'var(--fg-muted)' }}>{job.summary}</p>
                {job.eligibilityNote ? (
                  <div
                    style={{
                      margin: '0 0 16px',
                      padding: '12px 14px',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <div style={{ fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', opacity: 0.85 }}>
                      Eligibility
                    </div>
                    <div style={{ marginTop: 6, color: 'var(--fg-muted)' }}>{job.eligibilityNote}</div>
                  </div>
                ) : null}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span className="tag">Team: {job.team}</span>
                  <span className="tag">Location: {job.location}</span>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <strong>Responsibilities</strong>
                    <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--fg-muted)', fontSize: 14 }}>
                      {job.responsibilities.map(item => (
                        <li key={item} style={{ marginBottom: 6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong>Requirements</strong>
                    <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--fg-muted)', fontSize: 14 }}>
                      {job.requirements.map(item => (
                        <li key={item} style={{ marginBottom: 6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong>Nice to have</strong>
                    <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--fg-muted)', fontSize: 14 }}>
                      {job.niceToHave.map(item => (
                        <li key={item} style={{ marginBottom: 6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 14 }}>
                      
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Apply */}
        <section id="apply" className="section">
          <div className="container" data-reveal>
            <div className="section-header">
              <div>
                <p className="eyebrow">Apply</p>
                <h2>Send your resume.</h2>
              </div>
              </div>

            <div className="applyGrid">
              <div className="card">
                <CareersForm jobTitle={job.title} />
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>What happens next</h3>
                <ol style={{ paddingLeft: 18, color: 'var(--fg-muted)', fontSize: 14, marginTop: 10 }}>
                  <li style={{ marginBottom: 8 }}>
                    <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>Application review</strong> (within 7 business days)
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>30-minute call</strong>
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>Online competency assessment</strong>
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>Contract offer</strong>
                  </li>
                </ol>
                <p style={{ margin: '10px 0 0', color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6 }}>
                  We aim to review applications within <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>7 business days</strong>.
                  If you don’t hear back in that window, we may still be reviewing candidates. We do our best to respond to all
                  applicants, including rejections, but timelines can vary based on volume.
                </p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
                  <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 14 }}>
                    <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>Our Commitment</strong>
                    <br />
                    Auxerta, Inc. is an equal opportunity employer. We consider applicants without regard to race, color, religion, sex, gender identity or expression, sexual orientation, national origin, age, disability, veteran status, marital status, or any other status protected by applicable law.
                  </p>
                </div>
              </div>
            </div>

            </div>
        </section>
      </main>

      {/* Footer (matched to home) */}
      <SiteFooter />

      <style jsx>{`
        /* Make the Apply section readable on mobile without touching the rest of the site styles. */
        .applyGrid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 16px;
          margin-top: 14px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .applyGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
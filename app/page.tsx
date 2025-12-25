'use client';

  import { useEffect, useState, MouseEvent } from 'react';

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
                  We label your training data for computer vision, text, and LLMs. Senior annotators, clear guidelines, and fast turnaround.
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
                <div className="hero-annotation hero-annotation-flow">
                  <div className="hero-annotation-image hero-annotation-image-flow">
                    <div className="hero-layers">
                      <div className="hero-layer hero-layer-1" />
                      <div className="hero-layer hero-layer-2" />
                      <div className="hero-layer hero-layer-3" />
                    </div>
                  </div>
                </div>
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
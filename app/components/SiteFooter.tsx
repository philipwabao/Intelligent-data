'use client';

import Link from 'next/link';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand-block">
          <span className="footer-brand">Auxerta</span>
          <span className="footer-tagline">Enterprise data annotation.</span>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Product</h4>
            <span>Coming soon</span>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="/#contact">Contact</a>
            <span>Our mission</span>
            <Link href="/careers">Careers</Link>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <span>Documentation</span>
            <span>API reference</span>
            <span>Blog</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {year} Auxerta Inc. All rights reserved.</span>
          <div className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms-of-service">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

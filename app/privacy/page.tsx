import SiteFooter from '../components/SiteFooter';

export default function PrivacyPage() {
  return (
    <div className="page">
      <header className="nav">
        <div className="nav-inner container">
          <a href="/" className="brand">
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
          <nav className="nav-links">
            <a href="/#services">Services</a>            <a href="/#contact" className="nav-cta">
              Get started</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="section section-alt">
          <div className="container is-visible">
            <header className="section-header">
              <div>
                <p className="eyebrow">Legal</p>
                <h2>Privacy Policy</h2>
              </div>
              <p className="section-copy">
                How Auxerta collects, uses, and protects information when you work with us.
              </p>
            </header>

            <article className="card legal-article">
              <h2>1. Who we are</h2>
              <p>
                Auxerta Inc. ("Auxerta", "we", "us") provides data annotation services for
                machine learning teams. We work with image, text, and multi-modal datasets
                for enterprise clients.
              </p>

              <h2>2. What this policy covers</h2>
              <p>This policy explains how we handle information when you:</p>
              <ul>
                <li>Visit our website</li>
                <li>Contact us about a potential project</li>
                <li>Work with us as a client, partner, or vendor</li>
              </ul>

              <h2>3. Information we collect</h2>
              <h3>Information you provide</h3>
              <ul>
                <li>Contact details such as name, email address, and company</li>
                <li>Project information when you describe your dataset and use case</li>
                <li>Billing information needed for invoicing and payment</li>
              </ul>

              <h3>Information from using our site</h3>
              <ul>
                <li>Basic usage data such as pages visited and time on site</li>
                <li>Technical data such as IP address, browser type, and device</li>
                <li>Analytics information from tools like Google Analytics</li>
              </ul>

              <h2>4. Project and dataset data</h2>
              <p>
                You may share datasets with us so we can annotate them. These datasets remain
                your property or the property of your organization. We use them only to:
              </p>
              <ul>
                <li>Provide the annotation services you requested</li>
                <li>Run internal quality checks on the work we deliver to you</li>
              </ul>
              <p>
                We do not sell your datasets or share them with other clients. If you need us
                to delete project data after delivery, you can request that in writing, subject
                to any legal, security, or audit requirements.
              </p>

              <h2>5. How we use personal information</h2>
              <p>We use personal information to:</p>
              <ul>
                <li>Respond to inbound requests and questions</li>
                <li>Provide and manage data annotation services</li>
                <li>Send operational updates about projects and delivery</li>
                <li>Improve our processes, quality checks, and website</li>
                <li>Comply with legal, tax, and accounting obligations</li>
              </ul>

              <h2>6. Legal bases (where required)</h2>
              <p>
                Where data protection law requires a legal basis, we typically rely on:
              </p>
              <ul>
                <li>Performance of a contract (providing services you requested)</li>
                <li>Legitimate interests (running and improving Auxerta safely)</li>
                <li>Consent (for specific optional communications or features)</li>
              </ul>

              <h2>7. Sharing information</h2>
              <p>We may share information with:</p>
              <ul>
                <li>Vendors who provide hosting, email, analytics, and payment services</li>
                <li>Professional advisors such as lawyers and accountants</li>
                <li>Authorities, if we are legally required to do so</li>
                <li>
                  A buyer or successor, if Auxerta is involved in a merger, acquisition,
                  or similar transaction
                </li>
              </ul>
              <p>
                Vendors are allowed to use your information only to provide services to Auxerta,
                not for their own marketing.
              </p>

              <h2>8. Data retention</h2>
              <p>
                We keep personal information for as long as necessary to provide services,
                meet legal obligations, and resolve disputes. Data retention for specific
                projects can be adjusted based on your contractual requirements.
              </p>

              <h2>9. Security</h2>
              <p>
                We use reasonable technical and organizational measures to protect information,
                including access controls and encryption in transit. No system can be guaranteed
                100% secure, but our goal is to reduce risk and restrict access only to people
                who need it to do their work.
              </p>

              <h2>10. International transfers</h2>
              <p>
                Auxerta may process data in different regions depending on client location
                and infrastructure choices. When we move data across borders, we aim to use
                appropriate safeguards where required by law.
              </p>

              <h2>11. Your rights</h2>
              <p>
                Depending on your location, you may have rights such as accessing, correcting,
                or deleting your personal information, or objecting to certain types of use.
              </p>
              <p>
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@auxerta.com">privacy@auxerta.com</a>. We may need to
                verify your identity before responding.
              </p>

              <h2>12. Cookies and analytics</h2>
              <p>
                We use cookies and similar technologies to keep sessions active and understand
                how visitors use the site. You can control cookies through your browser
                settings, but some features may not function correctly if you disable them.
              </p>

              <h2>13. Third-party links</h2>
              <p>
                Our website may contain links to third-party sites. We are not responsible
                for their content or privacy practices. You should review their policies
                separately.
              </p>

              <h2>14. Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time. If we make material
                changes, we will update the "Last updated" date and, where appropriate,
                provide additional notice.
              </p>

              <h2>15. Contact</h2>
              <p>If you have questions about this policy, contact us at:</p>
              <ul>
                <li>
                  Privacy:{" "}
                  <a href="mailto:privacy@auxerta.com">privacy@auxerta.com</a>
                </li>
                <li>
                  General:{" "}
                  <a href="mailto:partner@auxerta.com">partner@auxerta.com</a>
                </li>
              </ul>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

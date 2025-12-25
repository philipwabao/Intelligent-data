import SiteFooter from '../components/SiteFooter';

export default function TermsOfServicePage() {
  const lastUpdated = "December 14, 2025";

  return (
    <div className="page">
      <header className="nav">
        <div className="nav-inner container">
          <a href="/" className="brand" aria-label="Auxerta home">
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

          <nav className="nav-links" aria-label="Primary">
            <a href="/#services">Services</a>            <a href="/#contact" className="nav-cta">
              Get started
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="section section-alt">
          <div className="container is-visible">
            <header className="section-header">
              <div>
                <p className="eyebrow">Legal</p>
                <h2>Terms of Service</h2>
              </div>
              <p className="section-copy">
                These terms govern your use of Auxerta’s website and annotation services. Last updated:{" "}
                <strong>{lastUpdated}</strong>.
              </p>
            </header>

            <article className="card legal-article">
              <h2>1. Agreement</h2>
              <p>
                By accessing or using Auxerta’s services, you agree to these Terms of Service. If you do not agree,
                do not use the services.
              </p>
              <p>
                We may update these terms from time to time. Material changes will be posted on this page. Continued
                use after changes means you accept the updated terms.
              </p>

              <h2>2. Eligibility</h2>
              <p>You may use our services only if you:</p>
              <ul>
                <li>Are at least 18 years old</li>
                <li>Can legally enter into a binding contract</li>
                <li>Are using the services on your own behalf or for an organization you are authorized to represent</li>
              </ul>

              <h2>3. Accounts and security</h2>
              <p>You are responsible for:</p>
              <ul>
                <li>Keeping account credentials confidential</li>
                <li>Ensuring information you provide to Auxerta is accurate</li>
                <li>All activity that occurs under your accounts</li>
              </ul>

              <h2>4. Acceptable use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the services for illegal activities or in violation of any law</li>
                <li>Upload content that infringes intellectual property, confidentiality, or privacy rights</li>
                <li>Introduce malware or attempt to disrupt, probe, or overload our systems</li>
                <li>Reverse engineer, scrape, or misuse our infrastructure</li>
                <li>Resell, sublicense, or provide access to the services without written permission</li>
              </ul>

              <h2>5. Project data and ownership</h2>
              <p>
                You or your organization retain ownership of project data you provide and the resulting annotations,
                unless otherwise agreed in a separate written contract or order form.
              </p>
              <p>
                By providing data, you grant Auxerta a limited license to process, annotate, and store that data to
                deliver the services and operate reasonable quality controls.
              </p>

              <h2>6. Payment and pricing</h2>
              <p>
                Pricing, payment terms, and deliverables are defined in proposals, statements of work, order forms, or
                other written agreements between you and Auxerta.
              </p>
              <p>
                You agree to pay all fees when due. Auxerta may suspend or limit services for unpaid or overdue invoices.
              </p>

              <h2>7. Service changes and availability</h2>
              <p>
                We may change or improve features over time. While we aim to provide stable service, we do not guarantee
                uninterrupted or error-free operation.
              </p>

              <h2>8. Confidentiality</h2>
              <p>
                Either party may disclose confidential information to the other. Each party agrees to use confidential
                information only for the purpose of the business relationship and to protect it with reasonable safeguards.
              </p>

              <h2>9. Disclaimer of warranties</h2>
              <p>
                The services are provided “as is” and “as available”. To the extent permitted by law, we disclaim all
                warranties, express or implied, including implied warranties of merchantability, fitness for a particular
                purpose, and non-infringement.
              </p>

              <h2>10. Limitation of liability</h2>
              <p>
                To the extent permitted by law, Auxerta will not be liable for indirect, incidental, consequential,
                special, or punitive damages, or for loss of profits or revenue.
              </p>
              <p>
                Our total liability for any claim related to the services is limited to the amount you paid Auxerta for
                those services in the 12 months before the event giving rise to the claim.
              </p>

              <h2>11. Termination</h2>
              <p>
                You may stop using the services at any time. We may suspend or terminate access if you materially breach
                these terms, do not pay fees when due, or misuse the services.
              </p>
              <p>
                Certain sections (including confidentiality, payment, disclaimers, and limitations of liability) will
                survive termination.
              </p>

              <h2>12. Governing law</h2>
              <p>
                Unless otherwise agreed in writing, these terms are governed by the laws of the jurisdiction where Auxerta
                is incorporated, without regard to conflict of law principles.
              </p>

              <h2>13. Entire agreement</h2>
              <p>
                These Terms of Service, along with any signed agreement, statement of work, or order form, make up the
                entire agreement between you and Auxerta regarding the services.
              </p>

              <h2>14. Contact</h2>
              <p>
                If you have questions about these terms, contact us at{" "}
                <a href="mailto:legal@auxerta.com">legal@auxerta.com</a> or{" "}
                <a href="mailto:partner@auxerta.com">partner@auxerta.com</a>.
              </p>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

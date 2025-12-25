'use client';

import { useMemo, useRef, useState } from 'react';

type Props = {
  jobTitle: string;
};

function prettyBytes(n: number) {
  if (!Number.isFinite(n) || n <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let u = 0;
  let v = n;
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024;
    u += 1;
  }
  return `${v.toFixed(u === 0 ? 0 : 1)} ${units[u]}`;
}

export default function CareersForm({ jobTitle }: Props) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [applicationId, setApplicationId] = useState<string>('');
  const [resumeName, setResumeName] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxBytes = 10 * 1024 * 1024;

  const inputStyle: React.CSSProperties = useMemo(
    () => ({
      width: '100%',
      borderRadius: 14,
      border: '1px solid var(--border)',
      background: 'rgba(255, 255, 255, 0.88)',
      padding: '11px 12px',
      fontSize: 14,
      lineHeight: 1.45,
      fontWeight: 500,
      outline: 'none',
      color: 'var(--fg)',
      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
      transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
    }),
    []
  );

  const labelStyle: React.CSSProperties = useMemo(
    () => ({
      fontSize: 12,
      color: 'var(--fg-muted)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginBottom: 6,
      display: 'block',
    }),
    []
  );


  function syncFileToInput(file: File) {
    // Ensure the actual <input type="file" /> contains the dropped/selected file,
    // so FormData(form) picks it up on submit.
    const input = fileInputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
  }

  function acceptAndSetFile(file: File | null | undefined) {
    if (!file) return;

    if (file.size > maxBytes) {
      setStatus('error');
      setError(`Resume too large. Max size is ${prettyBytes(maxBytes)}.`);
      return;
    }

    // Light type check (server should still validate).
    const ok =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx');

    if (!ok) {
      setStatus('error');
      setError('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    setError('');
    setResumeName(file.name);
    syncFileToInput(file);
  }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('uploading');
    setError('');
    setApplicationId('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const file = formData.get('resume') as File | null;
    if (!file || file.size === 0) {
      setStatus('error');
      setError('Please attach a resume file.');
      return;
    }
    if (file.size > maxBytes) {
      setStatus('error');
      setError(`Resume too large. Max size is ${prettyBytes(maxBytes)}.`);
      return;
    }

    formData.set('jobTitle', jobTitle);

    try {
      const res = await fetch('/api/resume', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setError(data?.error || 'Upload failed. Please try again.');
        return;
      }

      setStatus('success');
      setApplicationId(data?.applicationId || '');
      setResumeName('');
      form.reset();
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="careersForm">
      <div className="formHeader">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Applying for
          </div>
          <h3 style={{ margin: 0 }}>{jobTitle}</h3>
        </div>
              </div>

      <div className="grid2">
        <div>
          <label style={labelStyle}>Full name</label>
          <input name="name" autoComplete="name" required placeholder="Your name" className="input" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input name="email" autoComplete="email" required type="email" inputMode="email" placeholder="you@domain.com" className="input" style={inputStyle} />
        </div>
      </div>

      <div className="grid2">
        <div>
          <label style={labelStyle}>LinkedIn</label>
          <input name="linkedin" type="url" inputMode="url" placeholder="https://linkedin.com/in/..." className="input" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Portfolio / GitHub</label>
          <input name="portfolio" type="url" inputMode="url" placeholder="https://github.com/..." className="input" style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Short note</label>
        <textarea
          name="note"
          className="input"
          placeholder="A few lines on why you’re a fit (optional)."
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      
      <div>
        <label style={labelStyle}>Resume (PDF/DOC/DOCX, max {prettyBytes(maxBytes)})</label>

        <div
          className="dropzone"
          role="button"
          tabIndex={0}
          aria-label="Upload resume"
          onClick={openFileDialog}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openFileDialog();
            }
          }}
          onDragEnter={e => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragOver={e => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={e => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            acceptAndSetFile(e.dataTransfer.files?.[0]);
          }}
          style={{
            ...inputStyle,
            padding: '16px 14px',
            cursor: 'pointer',
            borderStyle: 'dashed',
            borderColor: dragActive ? 'rgba(99, 102, 241, 0.65)' : 'var(--border)',
            background: dragActive ? 'rgba(99, 102, 241, 0.06)' : 'rgba(255, 255, 255, 0.88)',
            display: 'grid',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 650 }}>
              {resumeName ? 'Resume selected' : 'Drop your resume here'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>Click to browse</div>
          </div>

          <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--fg-muted)' }}>
            {resumeName ? (
              <>
                <span style={{ color: 'var(--fg)' }}>{resumeName}</span>
                <span style={{ marginLeft: 8 }}>• Replace by dropping a new file</span>
              </>
            ) : (
              <>PDF/DOC/DOCX • up to {prettyBytes(maxBytes)}</>
            )}
          </div>

          <input
            ref={fileInputRef}
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            className="input"
            onChange={e => {
              // Reset any previous error before accepting a new file.
              setStatus('idle');
              setError('');
              acceptAndSetFile(e.currentTarget.files?.[0]);
            }}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <button className="btn btn-primary btn-primary-animated" type="submit" disabled={status === 'uploading'}>
        {status === 'uploading' ? 'Uploading…' : 'Submit application'}
      </button>

      {status === 'success' && (
        <div role="status" aria-live="polite"
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 12,
            background:
              'linear-gradient(135deg, rgba(34, 197, 94, 0.10), rgba(34, 193, 195, 0.10), rgba(59, 130, 246, 0.08))',
          }}
        >
          <strong>Submitted.</strong>
          {applicationId ? (
            <div style={{ color: 'var(--fg-muted)', marginTop: 6 }}>Application ID: {applicationId}</div>
          ) : null}
        </div>
      )}

      {status === 'error' && (
        <div role="alert" aria-live="assertive"
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 12,
            background:
              'linear-gradient(135deg, rgba(168, 85, 247, 0.10), rgba(59, 130, 246, 0.08), rgba(34, 193, 195, 0.08))',
          }}
        >
          <strong>Couldn’t submit.</strong>
          <div style={{ color: 'var(--fg-muted)', marginTop: 6 }}>{error}</div>
        </div>
      )}
    
      <style jsx>{`
        .careersForm {
          display: grid;
          gap: 14px;
        }
        .formHeader {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
        }
        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .help {
          margin-top: -6px;
          font-size: 12px;
          line-height: 1.45;
          color: var(--fg-muted);
        }
        /* Better focus + placeholder without relying on global CSS. */
        :global(.input:focus) {
          border-color: rgba(168, 85, 247, 0.55);
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.12), 0 10px 24px rgba(15, 23, 42, 0.06);
        }
        :global(.input::placeholder) {
          color: rgba(100, 116, 139, 0.75);
        }
        @media (max-width: 720px) {
          .formHeader {
            flex-direction: column;
            align-items: flex-start;
          }
          .grid2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </form>
  );
}

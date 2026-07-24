import React, { useState } from 'react';
import { CopyButton } from './FormControls.jsx';

function download(filename, contents) {
  const blob = new Blob([contents], { type: 'text/yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const TABS = [
  { key: 'client', label: 'Client Snippet' },
  { key: 'full', label: 'Full Provider Config' },
  { key: 'secret', label: 'Secrets' }
];

export default function OutputPanel({ clientFragmentYaml, fullProviderYaml, plainSecret, hmacSecret, clientName }) {
  const [tab, setTab] = useState('client');

  const content = tab === 'client' ? clientFragmentYaml : tab === 'full' ? fullProviderYaml : null;
  const filenameBase = (clientName || 'client').toLowerCase().replaceAll(/[^a-z0-9-]+/g, '-');

  return (
    <div className="card output-card">
      <div className="output-header">
        <h2>Generated Configuration</h2>
        <div className="tabs">
          {TABS.map(t => (
            <button key={t.key} type="button" className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab !== 'secret' ? (
        <>
          <div className="output-actions">
            <CopyButton getText={() => content} label="Copy YAML" />
            <button
              type="button"
              className="copy-btn"
              onClick={() => download(`${filenameBase}.${tab === 'full' ? 'authelia' : 'client'}.yml`, content)}
            >
              Download .yml
            </button>
          </div>
          <pre className="yaml-output">
            <code>{content}</code>
          </pre>
        </>
      ) : (
        <div className="secrets-panel">
          <div className="secret-row">
            <div>
              <strong>Plaintext Client Secret</strong>
              <p className="hint">Put this in your application's OIDC config. It is never stored in the Authelia YAML.</p>
              <code className="secret-value">{plainSecret || '(public client — no secret)'}</code>
            </div>
            {plainSecret ? <CopyButton getText={() => plainSecret} /> : null}
          </div>
          <div className="secret-row">
            <div>
              <strong>Provider HMAC Secret</strong>
              <p className="hint">Store this as an Authelia secret file / env var, not directly in the YAML.</p>
              <code className="secret-value">{hmacSecret || '(not generated)'}</code>
            </div>
            {hmacSecret ? <CopyButton getText={() => hmacSecret} /> : null}
          </div>
          <p className="warning">
            ⚠️ These values are generated locally in your browser and are never transmitted anywhere. Save them now — they are
            not recoverable once you close this page.
          </p>
        </div>
      )}
    </div>
  );
}

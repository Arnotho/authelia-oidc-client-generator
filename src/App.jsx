import React, { useEffect, useMemo, useState } from 'react';
import TemplateSelector from './components/TemplateSelector.jsx';
import ClientForm from './components/ClientForm.jsx';
import ProviderPanel from './components/ProviderPanel.jsx';
import OutputPanel from './components/OutputPanel.jsx';
import { buildClientFromTemplate, templates } from './lib/templates.js';
import { defaultProvider } from './lib/defaults.js';
import { generateClientId, generateSecret, generateHmacSecret, hashAutheliaSecret } from './lib/crypto.js';
import { generateClientFragmentYaml, generateProviderYaml } from './lib/yaml.js';

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export default function App() {
  const [templateKey, setTemplateKey] = useState('generic');
  const [client, setClient] = useState(() => ({
    ...buildClientFromTemplate('generic'),
    client_id: generateClientId()
  }));
  const [plainSecret, setPlainSecret] = useState('');
  const [showProvider, setShowProvider] = useState(false);
  const [provider, setProvider] = useState(() => ({ ...structuredClone(defaultProvider), hmac_secret: generateHmacSecret() }));

  // Regenerate a fresh plaintext secret + its Authelia hash whenever requested.
  async function regenerateSecret() {
    const secret = generateSecret();
    setPlainSecret(secret);
    const hash = await hashAutheliaSecret(secret);
    setClient(c => ({ ...c, client_secret: hash }));
  }

  // Initialize a secret on first mount for confidential clients.
  useEffect(() => {
    if (!client.public && !plainSecret) {
      regenerateSecret();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectTemplate(key) {
    setTemplateKey(key);
    const next = buildClientFromTemplate(key);
    setClient(c => ({ ...next, client_id: c.client_id || generateClientId(), client_name: next.client_name || c.client_name }));
    if (next.public) {
      setPlainSecret('');
      setClient(c => ({ ...c, client_secret: null }));
    } else if (!plainSecret) {
      regenerateSecret();
    }
  }

  function updateClient(next) {
    // Keep the plaintext secret in sync with visibility: switching to public clears it.
    if (next.public && !client.public) {
      setPlainSecret('');
      next = { ...next, client_secret: null, token_endpoint_auth_method: 'none' };
    }
    if (!next.public && client.public) {
      regenerateSecret();
    }
    setClient(next);
  }

  const debouncedClient = useDebouncedValue(client, 150);
  const debouncedProvider = useDebouncedValue(provider, 150);

  const clientFragmentYaml = useMemo(() => generateClientFragmentYaml(debouncedClient), [debouncedClient]);
  const fullProviderYaml = useMemo(
    () => generateProviderYaml(debouncedProvider, [debouncedClient]),
    [debouncedProvider, debouncedClient]
  );

  const activeTemplate = templates[templateKey] ?? templates.generic;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Authelia OIDC Client Generator</h1>
        <p>
          Generate secure <code>identity_providers.oidc</code> client configuration for{' '}
          <a href="https://www.authelia.com/configuration/identity-providers/openid-connect/provider/" target="_blank" rel="noreferrer">
            Authelia
          </a>
          . Everything runs locally in your browser — secrets never leave your machine.
        </p>
      </header>

      <main className="app-main">
        <div className="app-column">
          <TemplateSelector selected={templateKey} onSelect={selectTemplate} />

          <ClientForm
            client={client}
            plainSecret={plainSecret}
            onChange={updateClient}
            onRegenerateId={() => setClient(c => ({ ...c, client_id: generateClientId() }))}
            onRegenerateSecret={regenerateSecret}
            redirectPlaceholder={activeTemplate.redirectPlaceholder}
          />

          <div className="card">
            <label className="toggle-row">
              <ToggleAdvanced checked={showProvider} onChange={setShowProvider} />
              <span>Also configure Provider-level settings (hmac_secret, lifespans, CORS…)</span>
            </label>
            {showProvider && (
              <ProviderPanel
                provider={provider}
                onChange={setProvider}
                onRegenerateHmac={() => setProvider(p => ({ ...p, hmac_secret: generateHmacSecret() }))}
              />
            )}
          </div>
        </div>

        <div className="app-column sticky">
          <OutputPanel
            clientFragmentYaml={clientFragmentYaml}
            fullProviderYaml={fullProviderYaml}
            plainSecret={plainSecret}
            hmacSecret={provider.hmac_secret}
            clientName={client.client_name}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built for{' '}
          <a href="https://www.authelia.com/configuration/identity-providers/openid-connect/provider/" target="_blank" rel="noreferrer">
            Authelia OpenID Connect 1.0
          </a>
          . Deployable to Cloudflare Pages or Workers as a static site.
        </p>
      </footer>
    </div>
  );
}

function ToggleAdvanced({ checked, onChange }) {
  return (
    <span className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
    </span>
  );
}

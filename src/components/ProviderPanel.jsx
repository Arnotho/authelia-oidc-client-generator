import React from 'react';
import { ENFORCE_PKCE_MODES, AVAILABLE_CORS_ENDPOINTS } from '../lib/defaults.js';
import { Field, TextInput, SelectInput, ToggleInput, ListInput, CopyButton } from './FormControls.jsx';

export default function ProviderPanel({ provider, onChange, onRegenerateHmac }) {
  function set(key, value) {
    onChange({ ...provider, [key]: value });
  }

  function setLifespan(key, value) {
    onChange({ ...provider, lifespans: { ...provider.lifespans, [key]: value } });
  }

  function setCors(key, value) {
    onChange({ ...provider, cors: { ...provider.cors, [key]: value } });
  }

  function toggleCorsEndpoint(endpoint) {
    const current = new Set(provider.cors.endpoints ?? []);
    if (current.has(endpoint)) current.delete(endpoint);
    else current.add(endpoint);
    setCors('endpoints', [...current]);
  }

  return (
    <div className="card">
      <h2>Provider (optional)</h2>
      <p className="hint">
        These options live under <code>identity_providers.oidc</code>, alongside <code>clients</code>. Skip this section if you
        already have a provider configured and only need a client snippet.
      </p>

      <Field label="HMAC Secret" htmlFor="hmac_secret" hint="Used to sign issued JWTs. Store this as an Authelia secret, not plaintext, in production.">
        <div className="input-with-action">
          <TextInput id="hmac_secret" value={provider.hmac_secret} onChange={v => set('hmac_secret', v)} placeholder="Click regenerate to create one" />
          <button type="button" className="icon-btn" onClick={onRegenerateHmac} title="Regenerate">
            ⟳
          </button>
          <CopyButton getText={() => provider.hmac_secret} />
        </div>
      </Field>

      <div className="grid-2">
        <Field label="Enforce PKCE" htmlFor="enforce_pkce">
          <SelectInput id="enforce_pkce" value={provider.enforce_pkce} onChange={v => set('enforce_pkce', v)} options={ENFORCE_PKCE_MODES} />
        </Field>

        <Field label="Minimum Parameter Entropy" htmlFor="minimum_parameter_entropy">
          <TextInput
            id="minimum_parameter_entropy"
            type="number"
            value={provider.minimum_parameter_entropy}
            onChange={v => set('minimum_parameter_entropy', Number(v))}
          />
        </Field>
      </div>

      <h3>Token Lifespans</h3>
      <div className="grid-4">
        <Field label="Access Token" htmlFor="lifespan_access">
          <TextInput id="lifespan_access" value={provider.lifespans.access_token} onChange={v => setLifespan('access_token', v)} />
        </Field>
        <Field label="Authorize Code" htmlFor="lifespan_code">
          <TextInput id="lifespan_code" value={provider.lifespans.authorize_code} onChange={v => setLifespan('authorize_code', v)} />
        </Field>
        <Field label="ID Token" htmlFor="lifespan_id">
          <TextInput id="lifespan_id" value={provider.lifespans.id_token} onChange={v => setLifespan('id_token', v)} />
        </Field>
        <Field label="Refresh Token" htmlFor="lifespan_refresh">
          <TextInput id="lifespan_refresh" value={provider.lifespans.refresh_token} onChange={v => setLifespan('refresh_token', v)} />
        </Field>
      </div>

      <h3>CORS</h3>
      <Field label="Enabled Endpoints" hint="Which token/authorization endpoints should send CORS headers.">
        <div className="chip-group">
          {AVAILABLE_CORS_ENDPOINTS.map(ep => (
            <button
              type="button"
              key={ep}
              className={`chip${(provider.cors.endpoints ?? []).includes(ep) ? ' active' : ''}`}
              onClick={() => toggleCorsEndpoint(ep)}
            >
              {ep}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Allow Origins From Client Redirect URIs" htmlFor="cors_from_redirect">
        <ToggleInput
          id="cors_from_redirect"
          checked={provider.cors.allowed_origins_from_client_redirect_uris}
          onChange={v => setCors('allowed_origins_from_client_redirect_uris', v)}
        />
      </Field>

      <Field label="Additional Allowed Origins" hint="Extra origins beyond client redirect URIs (e.g. https://example.com).">
        <ListInput values={provider.cors.allowed_origins} onChange={v => setCors('allowed_origins', v)} placeholder="https://example.com" />
      </Field>
    </div>
  );
}

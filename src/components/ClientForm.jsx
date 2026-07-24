import React from 'react';
import {
  AUTHORIZATION_POLICIES,
  CONSENT_MODES,
  PKCE_CHALLENGE_METHODS,
  TOKEN_ENDPOINT_AUTH_METHODS,
  RESPONSE_TYPES,
  RESPONSE_MODES,
  GRANT_TYPES,
  AVAILABLE_SCOPES,
  SIGNING_ALGS
} from '../lib/defaults.js';
import { Field, TextInput, SelectInput, ToggleInput, ListInput, ChipMultiSelect, CopyButton } from './FormControls.jsx';

export default function ClientForm({ client, plainSecret, onChange, onRegenerateId, onRegenerateSecret, redirectPlaceholder }) {
  function set(key, value) {
    onChange({ ...client, [key]: value });
  }

  const isPublic = !!client.public;

  return (
    <div className="card">
      <h2>Client</h2>

      <div className="grid-2">
        <Field label="Client Name" htmlFor="client_name" hint="Human-friendly name shown in the consent screen.">
          <TextInput id="client_name" value={client.client_name} onChange={v => set('client_name', v)} placeholder="My Application" />
        </Field>

        <Field label="Client ID" htmlFor="client_id" hint="Public identifier for this client. Must be unique.">
          <div className="input-with-action">
            <TextInput id="client_id" value={client.client_id} onChange={v => set('client_id', v)} placeholder="my-application" />
            <button type="button" className="icon-btn" onClick={onRegenerateId} title="Regenerate">
              ⟳
            </button>
          </div>
        </Field>
      </div>

      <Field label="Client Type" hint="Public clients (SPAs, mobile/CLI apps) cannot securely store a secret and must use PKCE.">
        <div className="segmented">
          <button type="button" className={!isPublic ? 'active' : ''} onClick={() => set('public', false)}>
            Confidential
          </button>
          <button type="button" className={isPublic ? 'active' : ''} onClick={() => set('public', true)}>
            Public
          </button>
        </div>
      </Field>

      {!isPublic && (
        <Field
          label="Client Secret"
          htmlFor="client_secret"
          hint="Shown once as plaintext — copy it into your app's config now. Only the hash below is stored in Authelia's config."
        >
          <div className="input-with-action">
            <TextInput id="client_secret" value={plainSecret} type="text" disabled placeholder="Click regenerate to create a secret" />
            <button type="button" className="icon-btn" onClick={onRegenerateSecret} title="Regenerate">
              ⟳
            </button>
            <CopyButton getText={() => plainSecret} />
          </div>
        </Field>
      )}

      <Field label="Redirect URIs" hint="Exact-match callback URLs your application will use.">
        <ListInput
          values={client.redirect_uris}
          onChange={v => set('redirect_uris', v)}
          placeholder={redirectPlaceholder || 'https://app.example.com/callback'}
          addLabel="Add redirect URI"
        />
      </Field>

      <Field label="Scopes" hint="openid is always required. Hover a chip for details.">
        <ChipMultiSelect options={AVAILABLE_SCOPES} values={client.scopes} onChange={v => set('scopes', v)} />
      </Field>

      <Field label="Grant Types">
        <ChipMultiSelect options={GRANT_TYPES} values={client.grant_types} onChange={v => set('grant_types', v)} />
      </Field>

      <div className="grid-2">
        <Field label="Response Types" htmlFor="response_types">
          <SelectInput
            id="response_types"
            value={(client.response_types ?? []).join(' ')}
            onChange={v => set('response_types', v ? [v] : [])}
            options={RESPONSE_TYPES}
          />
        </Field>

        <Field label="Response Modes" htmlFor="response_modes">
          <SelectInput
            id="response_modes"
            value={(client.response_modes ?? [])[0] ?? 'query'}
            onChange={v => set('response_modes', v ? [v] : [])}
            options={RESPONSE_MODES}
          />
        </Field>
      </div>

      <h3>Authorization &amp; Consent</h3>

      <div className="grid-2">
        <Field label="Authorization Policy" htmlFor="authorization_policy" hint="Determines the 1FA/2FA requirement for this client.">
          <SelectInput
            id="authorization_policy"
            value={client.authorization_policy}
            onChange={v => set('authorization_policy', v)}
            options={AUTHORIZATION_POLICIES}
          />
        </Field>

        <Field label="Consent Mode" htmlFor="consent_mode">
          <SelectInput id="consent_mode" value={client.consent_mode} onChange={v => set('consent_mode', v)} options={CONSENT_MODES} />
        </Field>
      </div>

      {client.consent_mode === 'pre-configured' && (
        <Field label="Pre-configured Consent Duration" htmlFor="pre_configured_consent_duration" hint="e.g. 1 week, 90 days, 1 month">
          <TextInput
            id="pre_configured_consent_duration"
            value={client.pre_configured_consent_duration}
            onChange={v => set('pre_configured_consent_duration', v)}
          />
        </Field>
      )}

      <h3>PKCE &amp; Token Endpoint</h3>

      <div className="grid-2">
        <Field label="Require PKCE" htmlFor="require_pkce">
          <ToggleInput id="require_pkce" checked={client.require_pkce} onChange={v => set('require_pkce', v)} />
        </Field>

        <Field label="PKCE Challenge Method" htmlFor="pkce_challenge_method">
          <SelectInput
            id="pkce_challenge_method"
            value={client.pkce_challenge_method}
            onChange={v => set('pkce_challenge_method', v)}
            options={PKCE_CHALLENGE_METHODS}
            disabled={!client.require_pkce}
          />
        </Field>
      </div>

      <div className="grid-2">
        <Field
          label="Token Endpoint Auth Method"
          htmlFor="token_endpoint_auth_method"
          hint={isPublic ? 'Public clients should use "none".' : undefined}
        >
          <SelectInput
            id="token_endpoint_auth_method"
            value={client.token_endpoint_auth_method}
            onChange={v => set('token_endpoint_auth_method', v)}
            options={TOKEN_ENDPOINT_AUTH_METHODS}
          />
        </Field>

        <Field label="Require Pushed Authorization Requests (PAR)" htmlFor="require_par">
          <ToggleInput
            id="require_par"
            checked={client.require_pushed_authorization_requests}
            onChange={v => set('require_pushed_authorization_requests', v)}
          />
        </Field>
      </div>

      <h3>Response Signing</h3>

      <div className="grid-3">
        <Field label="id_token_signed_response_alg" htmlFor="id_token_alg">
          <SelectInput
            id="id_token_alg"
            value={client.id_token_signed_response_alg}
            onChange={v => set('id_token_signed_response_alg', v)}
            options={SIGNING_ALGS.filter(a => a !== 'none')}
          />
        </Field>

        <Field label="access_token_signed_response_alg" htmlFor="access_token_alg">
          <SelectInput
            id="access_token_alg"
            value={client.access_token_signed_response_alg}
            onChange={v => set('access_token_signed_response_alg', v)}
            options={SIGNING_ALGS}
          />
        </Field>

        <Field label="userinfo_signed_response_alg" htmlFor="userinfo_alg">
          <SelectInput
            id="userinfo_alg"
            value={client.userinfo_signed_response_alg}
            onChange={v => set('userinfo_signed_response_alg', v)}
            options={SIGNING_ALGS}
          />
        </Field>
      </div>
    </div>
  );
}

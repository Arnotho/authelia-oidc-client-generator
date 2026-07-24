import yaml from 'js-yaml';

// Field order mirrors the Authelia documentation so generated configs are easy to diff
// against: https://www.authelia.com/configuration/identity-providers/openid-connect/clients/
const CLIENT_FIELD_ORDER = [
  'client_id',
  'client_name',
  'client_secret',
  'public',
  'redirect_uris',
  'scopes',
  'grant_types',
  'response_types',
  'response_modes',
  'authorization_policy',
  'consent_mode',
  'pre_configured_consent_duration',
  'require_pkce',
  'pkce_challenge_method',
  'require_pushed_authorization_requests',
  'token_endpoint_auth_method',
  'id_token_signed_response_alg',
  'access_token_signed_response_alg',
  'userinfo_signed_response_alg',
  'authorization_signed_response_alg'
];

/** Removes empty strings / empty arrays / null / undefined so the exported YAML stays minimal. */
function pruneEmpty(value) {
  if (Array.isArray(value)) {
    const arr = value.filter(v => v !== '' && v !== null && v !== undefined);
    return arr;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const pruned = pruneEmpty(v);
      if (pruned === undefined || pruned === null || pruned === '') continue;
      if (Array.isArray(pruned) && pruned.length === 0) continue;
      out[k] = pruned;
    }
    return out;
  }
  return value;
}

function orderClient(client) {
  const ordered = {};
  for (const key of CLIENT_FIELD_ORDER) {
    if (client[key] !== undefined) ordered[key] = client[key];
  }
  // Include any extra fields not covered above (forward-compatible).
  for (const key of Object.keys(client)) {
    if (!(key in ordered)) ordered[key] = client[key];
  }
  return ordered;
}

/** Generates a full `identity_providers.oidc` block containing exactly one client. */
export function generateClientYaml(client) {
  const cleaned = pruneEmpty(orderClient(client));
  return yaml.dump(
    {
      identity_providers: {
        oidc: {
          clients: [cleaned]
        }
      }
    },
    { noRefs: true, lineWidth: -1 }
  );
}

/** Generates just the single client list-item YAML (to paste into an existing `clients:` list). */
export function generateClientFragmentYaml(client) {
  const cleaned = pruneEmpty(orderClient(client));
  return yaml.dump([cleaned], { noRefs: true, lineWidth: -1 });
}

/** Generates the full provider-level configuration, optionally embedding one or more clients. */
export function generateProviderYaml(provider, clients = []) {
  const cleanedProvider = pruneEmpty(provider);
  const cleanedClients = clients.map(c => pruneEmpty(orderClient(c)));

  return yaml.dump(
    {
      identity_providers: {
        oidc: {
          ...cleanedProvider,
          clients: cleanedClients
        }
      }
    },
    { noRefs: true, lineWidth: -1 }
  );
}

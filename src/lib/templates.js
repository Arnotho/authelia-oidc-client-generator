import { defaultClient } from './defaults.js';

// Application templates provide sensible starting points for common self-hosted apps.
// Each template only overrides the fields that differ from `defaultClient`; the generator
// merges these on top of the defaults so new options introduced in defaults.js automatically
// apply to every template.
export const templates = {
  generic: {
    name: 'Generic OIDC App',
    description: 'A sane, secure-by-default starting point for any standards-compliant OIDC client.',
    redirectPlaceholder: 'https://app.example.com/oauth2/callback',
    overrides: {}
  },
  memos: {
    name: 'Memos',
    description: 'https://www.usememos.com — self-hosted note-taking app.',
    redirectPlaceholder: 'https://memos.example.com/auth/callback',
    overrides: {
      scopes: ['openid', 'profile', 'email'],
      token_endpoint_auth_method: 'client_secret_post'
    }
  },
  'open-webui': {
    name: 'Open WebUI',
    description: 'https://openwebui.com — self-hosted LLM chat interface.',
    redirectPlaceholder: 'https://openwebui.example.com/oauth/oidc/callback',
    overrides: {
      scopes: ['openid', 'profile', 'email', 'groups'],
      token_endpoint_auth_method: 'client_secret_post'
    }
  },
  grafana: {
    name: 'Grafana',
    description: 'https://grafana.com — observability dashboards.',
    redirectPlaceholder: 'https://grafana.example.com/login/generic_oauth',
    overrides: {
      scopes: ['openid', 'profile', 'email', 'groups'],
      token_endpoint_auth_method: 'client_secret_basic'
    }
  },
  'hermes-agent': {
    name: 'Hermes Agent',
    description: 'Generic autonomous agent / MCP-style backend service client.',
    redirectPlaceholder: 'https://hermes.example.com/callback',
    overrides: {
      scopes: ['openid', 'profile', 'email'],
      token_endpoint_auth_method: 'client_secret_post'
    }
  },
  'gitea': {
    name: 'Gitea / Forgejo',
    description: 'https://gitea.io — self-hosted git service.',
    redirectPlaceholder: 'https://gitea.example.com/user/oauth2/authelia/callback',
    overrides: {
      scopes: ['openid', 'profile', 'email'],
      token_endpoint_auth_method: 'client_secret_post'
    }
  },
  'nextcloud': {
    name: 'Nextcloud',
    description: 'https://nextcloud.com — self-hosted productivity platform.',
    redirectPlaceholder: 'https://nextcloud.example.com/apps/user_oidc/code',
    overrides: {
      scopes: ['openid', 'profile', 'email', 'groups'],
      token_endpoint_auth_method: 'client_secret_post'
    }
  },
  'proxmox': {
    name: 'Proxmox VE',
    description: 'https://www.proxmox.com — virtualization management platform.',
    redirectPlaceholder: 'https://proxmox.example.com:8006',
    overrides: {
      scopes: ['openid', 'profile', 'email'],
      token_endpoint_auth_method: 'client_secret_post',
      response_types: ['code']
    }
  },
  'spa-public': {
    name: 'Public SPA (no backend)',
    description: 'Browser-only app that cannot keep a secret. Uses PKCE, no client secret.',
    redirectPlaceholder: 'https://spa.example.com/callback',
    overrides: {
      public: true,
      client_secret: null,
      require_pkce: true,
      pkce_challenge_method: 'S256',
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token']
    }
  },
  'device-code': {
    name: 'Device / CLI App',
    description: 'CLI tools or devices without a browser using the device authorization grant.',
    redirectPlaceholder: '',
    overrides: {
      public: true,
      client_secret: null,
      token_endpoint_auth_method: 'none',
      grant_types: ['urn:ietf:params:oauth:grant-type:device_code', 'refresh_token'],
      response_types: [],
      redirect_uris: []
    }
  }
};

export function buildClientFromTemplate(templateKey) {
  const template = templates[templateKey] ?? templates.generic;
  return {
    ...structuredClone(defaultClient),
    ...structuredClone(template.overrides)
  };
}

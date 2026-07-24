# Authelia OIDC Client Generator

A browser-based generator for [Authelia](https://www.authelia.com/) OpenID Connect 1.0 client
(and optional provider) configuration, built against the official documentation:

- [OpenID Connect 1.0 Provider](https://www.authelia.com/configuration/identity-providers/openid-connect/provider/)
- [OpenID Connect 1.0 Clients](https://www.authelia.com/configuration/identity-providers/openid-connect/clients/)

Everything runs **entirely client-side**. No server, no backend, no data collection —
secrets are generated with the Web Crypto API in your browser and never transmitted anywhere.

## Features

- Ready-made templates for common self-hosted apps (Memos, Grafana, Open WebUI, Gitea,
  Nextcloud, Proxmox, a generic public SPA, and a device/CLI flow) plus a blank generic client.
- Full client option coverage: scopes, grant types, response types/modes, authorization
  policy, consent mode, PKCE, token endpoint auth method, and response signing algorithms.
- Cryptographically secure, locally generated:
  - Client ID
  - Client secret (plaintext, shown once) + its Authelia PBKDF2-SHA512 hash for the YAML
  - Provider `hmac_secret`
- Optional Provider-level settings: `hmac_secret`, PKCE enforcement, token lifespans, and CORS.
- Exports a ready-to-paste client YAML snippet, or a full `identity_providers.oidc` block.
- Copy-to-clipboard and `.yml` download for every output.

## Security

All cryptographic material (client secrets, hashes, HMAC secrets) is generated locally in the
browser via `crypto.getRandomValues`/`crypto.subtle` and is never sent over the network. Secrets
are shown once — save them before navigating away.

## Development

```bash
npm install
npm run dev
```

## Deployment

This is a static single-page app (Vite + React), so it can be deployed to either
**Cloudflare Pages** or **Cloudflare Workers** (static assets) with no server-side code.

### Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name=authelia-oidc-client-generator
```

Or connect the repository in the Cloudflare dashboard (Workers & Pages → Create → Pages) with:

- Build command: `npm run build`
- Build output directory: `dist`

### Cloudflare Workers (static assets)

Configuration lives in [`wrangler.jsonc`](./wrangler.jsonc), pointing at the built `dist/`
directory with SPA fallback routing enabled.

```bash
npm run build
npx wrangler deploy
```

Both commands are also available as npm scripts: `npm run deploy:pages` and
`npm run deploy:workers` (they invoke `wrangler` via `npx`, so it does not need to be
installed as a project dependency — keeping `npm install`/`npm ci` fast for the Pages/Workers
CI build, which only ever runs `npm run build`).

// Reference: https://www.authelia.com/configuration/identity-providers/openid-connect/clients/
// Reference: https://www.authelia.com/configuration/identity-providers/openid-connect/provider/

export const AUTHORIZATION_POLICIES = ['one_factor', 'two_factor'];

export const CONSENT_MODES = ['auto', 'implicit', 'explicit', 'pre-configured'];

export const PKCE_CHALLENGE_METHODS = ['plain', 'S256'];

export const ENFORCE_PKCE_MODES = ['never', 'public_clients_only', 'always'];

export const TOKEN_ENDPOINT_AUTH_METHODS = [
  'none',
  'client_secret_post',
  'client_secret_basic',
  'client_secret_jwt',
  'private_key_jwt'
];

export const RESPONSE_TYPES = [
  'code',
  'code id_token',
  'id_token',
  'token id_token',
  'code token',
  'code token id_token'
];

export const RESPONSE_MODES = ['form_post', 'query', 'fragment', 'jwt'];

export const GRANT_TYPES = [
  'authorization_code',
  'implicit',
  'refresh_token',
  'client_credentials',
  'urn:ietf:params:oauth:grant-type:device_code'
];

export const REQUESTED_AUDIENCE_MODES = ['explicit', 'implicit'];

export const SIGNING_ALGS = ['none', 'RS256', 'PS256', 'ES256'];

export const AVAILABLE_SCOPES = [
  { value: 'openid', description: 'Required. Grants access to the sub claim.', locked: true },
  { value: 'offline_access', description: 'Allows requesting refresh tokens for long-lived access.' },
  { value: 'email', description: 'Grants access to email / email_verified claims.' },
  { value: 'profile', description: 'Grants access to profile claims (name, etc).' },
  { value: 'groups', description: 'Grants access to the groups claim.' },
  { value: 'authelia.bearer.authz', description: 'Enables usage of the token as a bearer authorization token.' }
];

export const AVAILABLE_CORS_ENDPOINTS = ['authorization', 'pushed-authorization-request', 'token', 'revocation', 'introspection', 'userinfo'];

export const JWKS_ALGORITHMS = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'];

// Sensible, secure-by-default client configuration matching Authelia's documented defaults.
export const defaultClient = {
  client_id: '',
  client_name: '',
  client_secret: '',
  public: false,
  redirect_uris: [''],
  scopes: ['openid', 'profile', 'email'],
  grant_types: ['authorization_code'],
  response_types: ['code'],
  response_modes: ['query'],
  authorization_policy: 'two_factor',
  consent_mode: 'auto',
  pre_configured_consent_duration: '1 week',
  require_pkce: true,
  pkce_challenge_method: 'S256',
  require_pushed_authorization_requests: false,
  token_endpoint_auth_method: 'client_secret_basic',
  id_token_signed_response_alg: 'RS256',
  access_token_signed_response_alg: 'none',
  userinfo_signed_response_alg: 'none',
  authorization_signed_response_alg: 'none'
};

// Default (opinionated) OIDC Provider level settings, used for the "server config" preview.
export const defaultProvider = {
  hmac_secret: '',
  enforce_pkce: 'public_clients_only',
  enable_pkce_plain_challenge: false,
  minimum_parameter_entropy: 8,
  enable_jwt_access_token_stateless_introspection: false,
  require_pushed_authorization_requests: false,
  lifespans: {
    access_token: '1h',
    authorize_code: '1m',
    id_token: '1h',
    refresh_token: '90m'
  },
  cors: {
    endpoints: ['authorization', 'token', 'revocation', 'introspection'],
    allowed_origins: [],
    allowed_origins_from_client_redirect_uris: true
  }
};

import { defaultClient } from './defaults.js';

export const templates = {
  generic: {
    name: 'Generic OIDC',
    config: { ...defaultClient }
  },
  memos: {
    name: 'Memos',
    config: { ...defaultClient }
  },
  hermes: {
    name: 'Hermes Agent',
    config: { ...defaultClient }
  },
  openwebui: {
    name: 'Open WebUI',
    config: { ...defaultClient }
  },
  grafana: {
    name: 'Grafana',
    config: { ...defaultClient }
  }
};

import yaml from 'js-yaml';

export function generateYaml(client) {
  return yaml.dump({
    identity_providers: {
      oidc: {
        clients: [client]
      }
    }
  }, { noRefs: true });
}

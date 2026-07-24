import React, { useState } from 'react';
import { generateSecret, hashAutheliaSecret } from './lib/crypto.js';
import { generateYaml } from './lib/yaml.js';
import { templates } from './lib/templates.js';

export default function App() {
  const [name, setName] = useState('HOME');
  const [uri, setUri] = useState('');
  const [output, setOutput] = useState('');

  async function generate() {
    const secret = generateSecret();
    const hash = await hashAutheliaSecret(secret);
    const yaml = generateYaml({
      client_name: name,
      client_id: crypto.randomUUID(),
      client_secret: hash,
      redirect_uris: [uri],
      ...templates.generic
    });
    setOutput(`Client Secret:\n${secret}\n\nAuthelia YAML:\n${yaml}`);
  }

  return <main>
    <h1>Authelia OIDC Client Generator</h1>
    <label>Client Name</label>
    <input value={name} onChange={e => setName(e.target.value)} />
    <label>Redirect URI</label>
    <input value={uri} onChange={e => setUri(e.target.value)} />
    <button onClick={generate}>Generate</button>
    <pre>{output}</pre>
  </main>;
}

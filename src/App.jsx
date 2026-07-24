import React, { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [uri, setUri] = useState('');

  return <main>
    <h1>Authelia OIDC Client Generator</h1>
    <label>Client Name</label>
    <input value={name} onChange={e => setName(e.target.value)} />
    <label>Redirect URI</label>
    <input value={uri} onChange={e => setUri(e.target.value)} />
    <pre>{`client_name: ${name}\nredirect_uri: ${uri}`}</pre>
  </main>;
}

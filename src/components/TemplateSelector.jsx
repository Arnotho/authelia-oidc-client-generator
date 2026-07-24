import React from 'react';
import { templates } from '../lib/templates.js';

export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div className="card">
      <h2>1. Choose a starting point</h2>
      <div className="template-grid">
        {Object.entries(templates).map(([key, tpl]) => (
          <button
            type="button"
            key={key}
            className={`template-tile${selected === key ? ' active' : ''}`}
            onClick={() => onSelect(key)}
          >
            <span className="template-name">{tpl.name}</span>
            <span className="template-desc">{tpl.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

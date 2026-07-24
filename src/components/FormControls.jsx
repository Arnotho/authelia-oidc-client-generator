import React from 'react';

export function Field({ label, hint, children, htmlFor }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export function TextInput({ id, value, onChange, placeholder, type = 'text', disabled = false }) {
  return (
    <input
      id={id}
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
    />
  );
}

export function SelectInput({ id, value, onChange, options, disabled = false }) {
  return (
    <select id={id} value={value} disabled={disabled} onChange={e => onChange(e.target.value)}>
      {options.map(opt => {
        const optValue = typeof opt === 'string' ? opt : opt.value;
        const optLabel = typeof opt === 'string' ? opt : (opt.label ?? opt.value);
        return (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        );
      })}
    </select>
  );
}

export function ToggleInput({ id, checked, onChange, disabled = false }) {
  return (
    <label className="toggle">
      <input id={id} type="checkbox" checked={!!checked} disabled={disabled} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
    </label>
  );
}

/** Editable list of free-text values (redirect URIs, allowed origins, etc). */
export function ListInput({ values, onChange, placeholder, addLabel = 'Add' }) {
  const list = values ?? [];

  function updateAt(index, value) {
    const next = [...list];
    next[index] = value;
    onChange(next);
  }

  function removeAt(index) {
    onChange(list.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...list, '']);
  }

  return (
    <div className="list-input">
      {list.map((value, index) => (
        <div className="list-input-row" key={index}>
          <input value={value} placeholder={placeholder} onChange={e => updateAt(index, e.target.value)} />
          <button type="button" className="icon-btn danger" onClick={() => removeAt(index)} aria-label="Remove">
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="link-btn" onClick={add}>
        + {addLabel}
      </button>
    </div>
  );
}

/** Multi-select rendered as toggleable chips, used for scopes / grant types / response types. */
export function ChipMultiSelect({ options, values, onChange }) {
  const selected = new Set(values ?? []);

  function toggle(value, locked) {
    if (locked) return;
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange([...next]);
  }

  return (
    <div className="chip-group">
      {options.map(opt => {
        const value = typeof opt === 'string' ? opt : opt.value;
        const description = typeof opt === 'string' ? undefined : opt.description;
        const locked = typeof opt === 'string' ? false : !!opt.locked;
        const active = selected.has(value);
        return (
          <button
            type="button"
            key={value}
            className={`chip${active ? ' active' : ''}${locked ? ' locked' : ''}`}
            onClick={() => toggle(value, locked)}
            title={description}
          >
            {value}
            {locked ? ' 🔒' : ''}
          </button>
        );
      })}
    </div>
  );
}

export function CopyButton({ getText, label = 'Copy' }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may be unavailable (insecure context); ignore silently.
    }
  }

  return (
    <button type="button" className="copy-btn" onClick={copy}>
      {copied ? '✓ Copied' : label}
    </button>
  );
}

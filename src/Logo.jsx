import React from 'react';

export function Logo({ compact = false }) {
  return <span className={compact ? 'logo-lockup logo-compact' : 'logo-lockup'}><img className="logo-mark" src="/showscout-mark.png" alt="" aria-hidden="true"/><span>Show<span>Scout</span></span></span>;
}

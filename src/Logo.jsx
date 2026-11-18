import React from 'react';

export function Logo({ compact = false }) {
  return <img className={compact ? 'logo-image logo-compact' : 'logo-image'} src="/showscout-logo.svg" alt="ShowScout" />;
}

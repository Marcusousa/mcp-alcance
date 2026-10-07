import React from 'react';

export function ColorHEX({theme, hex}) {

  return (
    <div
      data-alc-theme={theme ? theme : "light"}
      style={{
        backgroundColor: 'var(--alc-color-surface)',
        padding: '12px',
        display: 'inline-flex',
      }}
    >
      <div
        style={{
          backgroundColor: '#' + hex,
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          border: '1px dashed',
          borderColor: 'var(--alc-color-border)',
        }}
      ></div>
    </div>
  )
}


export function Scale({width, height}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--alc-color-link-text)',
        width: width + 'px',
        height: height + 'px',
        borderRadius: '4px',
        margin: '0 auto',
      }}
    >
    </div>
  )
}
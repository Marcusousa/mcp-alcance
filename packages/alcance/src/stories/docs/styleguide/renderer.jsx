import React from 'react';


export function Text({theme, token}) {

  return (
    <div
      data-alc-theme={theme ? theme : "light"}
      style={{
        backgroundColor: 'var(--alc-color-surface)',
        width: '64px',
        // height: '64px',
      }}
    >
      <div
        style={{
          color: 'var(' + token + ')',
          fontWeight: 'bold',
          fontSize: '24px',
          lineHeight: '64px',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >A</div>
    </div>
  )
}

export function Surface({theme}) {

  return (
    <div
      data-alc-theme={theme ? theme : "light"}
      style={{
        backgroundColor: 'var(--alc-color-surface)',
        width: '64px',
        height: '64px',
        borderRadius: '4px',
        border: '1px dashed',
        borderColor: 'var(--alc-color-border)',
      }}
    ></div>
  )
}

export function Color({theme, token}) {

  return (
    <div
      data-alc-theme={theme ? theme : "light"}
      style={{
        backgroundColor: 'var(--alc-color-surface)',
        padding: '12px',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(' + token + ')',
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

export function BorderColor({theme, token}) {

  return (
    <div
      data-alc-theme={theme ? theme : "light"}
      style={{
        backgroundColor: 'var(--alc-color-surface)',
        padding: '12px',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--alc-color-surface)',
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: 'var(' + token + ')',
        }}
      ></div>
    </div>
  )
}

export function Radius({token}) {

  return (
      <div
        style={{
          backgroundColor: 'transparent',
          width: '64px',
          height: '64px',
          borderRadius: 'var(' + token + ')',
          border: '1px solid',
          borderColor: 'var(--alc-color-border)',
        }}

      ></div>
  )
}

export function Spacing({token}) {

  return (
      <div
        style={{
          backgroundColor: 'var(--alc-color-info-50)',
          width: `var(${token})`,
          height: `var(${token})`,
        }}
      ></div>
  )
}


export function Scale({fontSize, lineHeight}) {
  return (
    <div
      style={{
        color: 'var(--alc-color-text-primary)',
        fontSize: 'var(' + fontSize + ')',
        lineHeight: 'var(' + lineHeight + ')',
        fontFamily: 'Roboto, system-ui, sans-serif'
      }}
    >
      Abcdefg
    </div>
  )
}
/*
  Controle do tema.
  Inspirado em "Dark mode Series' Articles": https://dev.to/ayc0/series/12983
 */

function loadUserPreference(): string {
  if (typeof localStorage === 'undefined') return 'system';
  return localStorage.getItem('alc-theme') || 'system';
}

function saveUserPreference(theme: 'light' | 'dark') : void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('alc-theme', theme);
}

function removeUserPreference() : void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('alc-theme');
}

function getAppliedTheme(userPreference: string) : 'light' | 'dark' {
  // Usuário definiu sua preferência (light ou dark)
  if (userPreference === 'light') {
    return 'light';
  }
  if (userPreference === 'dark') {
    return 'dark';
  }

  // Usuário não definiu sua preferência aqui
  // mas indicou dark por meio do sistema operacional
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // Por default, light
  return 'light';
}

function setAppliedTheme(theme: 'light' | 'dark') : void {

  let themeTag = document.querySelector('html').dataset.alcThemeTag ;

  themeTag = themeTag === undefined ? 'html' : themeTag;

  if (themeTag === '') {
    return;
  }

  const tags = document.querySelectorAll(themeTag);

  tags.forEach(tag => {
    if (tag instanceof HTMLElement) {
      tag.dataset['alcTheme'] = theme;
    };
  });
}

export { loadUserPreference, saveUserPreference, removeUserPreference, getAppliedTheme, setAppliedTheme };
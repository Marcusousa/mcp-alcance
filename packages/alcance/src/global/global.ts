import { loadUserPreference, getAppliedTheme, setAppliedTheme } from '../components/utils/theme';

export default function () {
  // Ajuste inicial do tema
  const userPreference = loadUserPreference();
  setAppliedTheme(getAppliedTheme(userPreference));
}
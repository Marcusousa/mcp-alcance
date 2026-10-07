import type {
  Renderer,
  PartialStoryFn as StoryFunction,
  StoryContext,
} from "storybook/internal/types";
import { useEffect, useGlobals } from "storybook/preview-api";
import { DARK_MODE } from "./constants";

localStorage.setItem('alc-theme', 'light');

export const withGlobals = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>
) => {
  const [globals] = useGlobals();
  const darkMode = globals[DARK_MODE];
  const { viewMode, id } = context;

  const isInDocs = viewMode === 'docs';

  useEffect(() => {
    setThemeTag('html');
  }, [isInDocs, id]);

  useEffect(() => {
    setTheme('#storybook-root', { darkMode });
  }, [darkMode, isInDocs, id]);

  return StoryFn();
};

const setThemeTag = (selector) => {
  const element = querySelectorWithLog(selector);
  if (!element) return;

  element.setAttribute('data-alc-theme-tag', '#storybook-root');
  element.removeAttribute('data-alc-theme');
};

const setTheme = (selector, { darkMode }) => {
  const rootElement = querySelectorWithLog(selector);
  const docsElement = querySelectorWithLog('#storybook-docs');

  const isDocsHidden = docsElement?.getAttribute('hidden') === 'true';

  if (rootElement && isDocsHidden) {
    setBodyBackgroundColor(darkMode ? '#111818' : '#fff');
  } else {
    setBodyBackgroundColor('#fff');
  }

  if (docsElement) {
    docsElement.setAttribute('data-alc-theme', 'light');
  }

  if (rootElement) {
    rootElement.setAttribute('data-alc-theme', darkMode ? 'dark' : 'light');
  }
};

// Funções auxiliares
const querySelectorWithLog = (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    console.log(`Elemento não encontrado: ${selector}`);
  }
  return element;
};

const setBodyBackgroundColor = (color) => {
  document.body.style.backgroundColor = color;
};
